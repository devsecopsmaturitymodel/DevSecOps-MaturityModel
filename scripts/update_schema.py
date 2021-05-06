# This script is used for temporary schema changes and will not last long
from re import findall
from urllib.parse import urlparse
import sys
from pathlib import Path

import html2markdown
import pandas as pd
from yaml import safe_dump, safe_load


def as_list(risk):
    if isinstance(risk, str):
        return [risk]
    return risk


def i_to_dict(i: str):
        i = html2markdown.convert(i)
        ret = {"name": i, "tags": []}
        if ghrepo := findall("https://[a-z/0-9A-Z._-]+", i):
            repo = urlparse(ghrepo[0]).path.strip("/")
            ret["url"] = ghrepo[0]
        if name := findall(r"^\[([^\]]+)\]", i):
            ret["name"] = name[0]
        if len(i) > 100:
            ret["description"] = i
            ret["name"] = i[:20]
        ret["name"] = ret["name"].strip()
        return ret


def format_implementation(fpath="data/dimensions.yaml"):
    # Use the ruamel.yaml to preserve anchors.
    import ruamel.yaml

    y = ruamel.yaml.YAML(typ="rt")

    dimensions = y.load(Path(fpath).read_text())

    # for dimension, v in dimensions.items():
    #     if dimension.startswith("_"): continue
    for subdimension, activity_d in dimensions.items():
        if subdimension.startswith("_"):
            continue
        for activity, data in activity_d.items():
            if "risk" in data:
                if isinstance(data["risk"], str):
                    data["risk"] = [data["risk"]]
            if v := data.get("implementation"):
                if isinstance(v, str):
                    raise ValueError(v)
                data["implementation"] = [i_to_dict(i) for i in v]

    y.dump(dimensions, stream=Path(fpath))
    return dimensions


def format_references(fpath="data/dimensions.yaml"):
    # Use the ruamel.yaml to preserve anchors.
    import ruamel.yaml

    y = ruamel.yaml.YAML(typ="rt")

    dimensions = y.load(Path(fpath).read_text())

    # for dimension, v in dimensions.items():
    #     if dimension.startswith("_"): continue
    for subdimension, activity_d in dimensions.items():
        if subdimension.startswith("_"):
            continue
        for activity, data in activity_d.items():
            if "risk" in data:
                if isinstance(data["risk"], str):
                    data["risk"] = [data["risk"]]
            if v := data.get("implementation"):
                if isinstance(v, str):
                    data["implementation"] = v.split(",")
            else:
                data["implementation"] = []

            continue
            if "references" not in data:  # Old model
                references = []
                for refid in ("samm", "samm2", "iso27001-2017"):
                    for s in as_list(data.get(refid, [])):
                        references.append(f"{refid}:{s}")
                    if refid in data:
                        del data[refid]
                data["references"] = references
            elif not isinstance(data["references"], list):  # intermediate model with dict refs.
                references = []
                for refid in ("samm", "samm2", "iso27001-2017"):
                    for s in as_list(data["references"].get(refid, [])):
                        references.append(f"{refid}:{s}")
                data["references"] = references
    y.dump(dimensions, stream=Path(fpath))
    return dimensions


def test_references():
    format_references("data-new/BuildAndDeployment/Sub-Dimensions.yaml")

def test_implementation():
    format_implementation("data-new/BuildAndDeployment/Sub-Dimensions.yaml")

if __name__ == "__main__":
    format_implementation(sys.argv[1])

if __name__ == "main__":

    columns = [
        "dimension",
        "subdimension",
        "activity",
        "risk",
        # "implementation"
        "references",
    ]
    dimensions = format_references()
    Path("/tmp/dim.yaml").write_text(safe_dump(dimensions, indent=2))

    activities = [
        (
            dimension,
            subdimension,
            activity,
            risk,
            # implementation
            references,
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
