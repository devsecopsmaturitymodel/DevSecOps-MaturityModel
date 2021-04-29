#!/usr/bin/env python3
import collections.abc
from glob import glob
from pathlib import Path

from yaml import safe_dump as yaml_dump
from yaml import safe_load as yaml_load


def dict_merge(*args, add_keys=True):
    assert len(args) >= 2, "dict_merge requires at least two dicts to merge"
    rtn_dct = args[0].copy()
    merge_dicts = args[1:]
    for merge_dct in merge_dicts:
        if add_keys is False:
            merge_dct = {
                key: merge_dct[key] for key in set(rtn_dct).intersection(set(merge_dct))
            }
        for k, v in merge_dct.items():
            if not rtn_dct.get(k):
                rtn_dct[k] = v
            elif k in rtn_dct and type(v) != type(rtn_dct[k]):
                raise TypeError(
                    f"Overlapping keys exist with different types: original is {type(rtn_dct[k])}, new value is {type(v)}"
                )
            elif isinstance(rtn_dct[k], dict) and isinstance(
                merge_dct[k], collections.abc.Mapping
            ):
                rtn_dct[k] = dict_merge(rtn_dct[k], merge_dct[k], add_keys=add_keys)
            elif isinstance(v, list):
                for list_value in v:
                    if list_value not in rtn_dct[k]:
                        rtn_dct[k].append(list_value)
            else:
                rtn_dct[k] = v
    return rtn_dct


if __name__ == "__main__":
    ret = {}

    for f in glob("data-new/*/*"):
        dimension = f.split("/")[1]
        if dimension not in ret:
            ret[dimension] = {}
            print("Found " + dimension)
        ret[dimension] = dict_merge(ret[dimension], yaml_load(Path(f).read_text()))

    Path("data/dimensions.yaml").write_text(yaml_dump(ret))
