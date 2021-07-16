from jsonpath_ng import jsonpath, parse
import re
from typing import List
import yaml
from pathlib import Path
import logging
from functools import reduce
import click

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


import ruamel.yaml

y = ruamel.yaml.YAML(typ="rt")


def yl(fpath):
    # return yaml.safe_load(Path(fpath).read_text())
    return y.load(Path(fpath).read_text())


def yd(fpath, data):
    # return Path(fpath).write_text(yaml.safe_dump(data, indent=2))
    return y.dump(data, stream=Path(fpath))


def test_jpath():
    fpath = (
        "data/dimensions-subdimensions-activities/BuildAndDeployment/Sub-Dimensions.yaml"
    )
    d = yl()
    t = [x for x in parse("$..implementation").find(d)]
    for i in t:
        normalize_keyword(i.value)
    yd(fpath, d)


def test_create_index():
    implementations = [
        {
            "name": "CI/CD tools",
            "tags": ["ci-cd"],
            "description": "CI/CD tools such as jenkins, gitlab-ci or github-actions",
        },
        {
            "name": "Container technologies and orchestration like Docker, Kubernetes",
            "tags": [],
        },
    ]
    dest = {}


def normalize_keyword(implementations: List, kw: str = "implementation", dpath = "implementations.yaml"):
    dest = {}
    jpath = f"{kw}s"
    for e, i in enumerate(implementations):
        if "$ref" in i:
            continue
        uuid = i["name"].lower()[:20]
        uuid = re.sub(r"[^0-9a-zA-Z]+", "-", uuid).strip("- ")
        dest[uuid] = i
        implementations[e] = {"$ref": f"{dpath}#/{jpath}/{uuid}"}
    return jpath, dest


def full_path(e):
    return list(reversed(list(_path(e))))


def _path(p):
    while hasattr(p, "left"):
        yield _value(p)
        p = p.left
    yield _value(p)


def _value(e):
    try:
        return e.fields[0]
    except AttributeError:
        return e.right.fields[0]


def get_item_by_keys(_d, _needle):
    return reduce(dict.__getitem__, _needle, _d)


from jsonpointer import resolve_pointer


def resolve_refs(data, context_path="."):
    context_path = Path(context_path)
    for item in parse("$..'$ref'").find(data):
        ref = item.value
        *fpath, jpath = ref.split("#", 2)
        # Resolve jpath from external file or
        #   internal data.
        jdata = yl(context_path / fpath[0]) if fpath and fpath[0] else data
        rdata = resolve_pointer(jdata, jpath)

        # Supports both dict and lists.
        k = item.context.path.fields[0] if hasattr(item.context.path, "fields") else item.context.path.index
        ctx = item.context.context.value
        ctx[k] = rdata
    return data


def test_resolve_refs():
    data = {"foo": {"$ref": "tmp-implementations.yaml#/implementations/ansible"}}
    r = resolve_refs(data)
    assert "name" in data["foo"]


def test_resolve_refs_2():
    data = {"bar": [{"$ref": "tmp-implementations.yaml#/implementations/ansible"}]}
    r = resolve_refs(data)
    assert "name" in data["bar"][0]

    raise NotImplementedError


@click.command()
@click.option("--fpath", type=Path, required=True, )
@click.option("--kw", type=str, required=True, default="implementation")
@click.option("--action", type=str)
@click.option("--root", type=Path, help="Root directory for retrieving jsonpointers.")
@click.option("--dpath", type=Path, help="Output file.")
def main(action, fpath, kw, root, dpath):

    if action == "n":
        data = normalize(kw, fpath, dpath)
        yd(fpath, data)
        return
    if action == "d":
        data = denormalize(root, fpath)
        yd(dpath, data)
        return

def normalize(kw, fpath, dpath):
    d = yl(fpath)
    t = [x for x in parse(f"$..{kw}").find(d)]
    for i in t:
        jpath, dest = normalize_keyword(i.value, kw=kw, dpath=dpath)

        dpath = Path(dpath)
        db = yl(dpath) if dpath.exists() else {jpath: {}}
        db[jpath].update(dest)
        yd(dpath, data=db)
    return d


def denormalize(root, fpath):
    d = yl(fpath)
    d1 = resolve_refs(d, context_path=Path(root))
    return d1



if __name__ == "__main__":
    main()
