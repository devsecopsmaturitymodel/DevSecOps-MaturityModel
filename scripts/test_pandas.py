import pandas as pd
from yaml import safe_load, safe_dump
from pathlib import Path


def as_list(risk):
    if isinstance(risk, str):
        return [risk]
    return risk



def format_references(fpath = "data/dimensions.yaml"):
  # Use the ruamel.yaml to preserve anchors.
  import ruamel.yaml
  y = ruamel.yaml.YAML(typ='rt')

  dimensions = y.load(Path(fpath).read_text())

 # for dimension, v in dimensions.items():
 #     if dimension.startswith("_"): continue
  for subdimension, activity_d in dimensions.items():
    if  subdimension.startswith("_"): continue
    for activity, data in activity_d.items():
      if "references" not in data:
        references = []
        for refid in ('samm', 'samm2', "iso27001-2017"):
          for s in as_list(data.get(refid, [])):
            references.append(f"{refid}:{s}")
          if refid in data:
            del data[refid]
        data["references"] = references
      else:
        references = []
        for refid in ('samm', 'samm2', "iso27001-2017"):
          for s in as_list(data["references"].get(refid, [])):
            references.append(f"{refid}:{s}")
        data["references"] = references
  y.dump(dimensions, stream=Path(fpath + ".new"))
  return dimensions


def test_format():
  format_references("data-new/BuildAndDeployment/Sub-Dimensions.yaml")


if __name__ == '__main__':

  columns = ["dimension", "subdimension", "activity", "risk",
  #"implementation"
  "references",
  ]
  dimensions = format_references()
  Path("/tmp/dim.yaml").write_text(safe_dump(dimensions, indent=2))

  activities = [
      (dimension, subdimension, activity, risk,
      #implementation
      references
    )
      for dimension, v in dimensions.items()
      if not dimension.startswith("_")
      for subdimension, activity_d in v.items()
      if not subdimension.startswith("_")
      for activity, data in activity_d.items()
      if not activity.startswith("_")
      for risk in as_list(data.get("risk", []))
    #  for implementation in as_list(data.get("implementation", [])) or []
      for references in as_list(data.get("references", [])) or []

  ]
  df = pd.DataFrame(activities, columns=columns)
  df.to_csv("references.csv")
