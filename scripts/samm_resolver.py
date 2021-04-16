#
# Parses yaml files contained in https://github.com/OWASP/samm/tree/master/Supporting%20Resources/v2.0/Datamodel/Datafiles
#
from pathlib import Path

import yaml


def read_yaml(f):
    return yaml.safe_load(Path(f).read_text())


class SammResolver:
    def __init__(self, basepath="."):
        self.basepath = Path(basepath)
        self.functions = [
            f.name[:-4].split(" ")[1] for f in self.basepath.glob("Function *yml")
        ]
        self.functions_map = {x[0]: x for x in self.functions}
        self.practices_map = self._parse_practices()
        self.streams = self._parse_streams()
        self.activities = list(
            set([f.name[:-4].split(" ")[1] for f in self.basepath.glob("Activit*.yml")])
        )

    def _parse_practices(self):
        practices = {}
        for f in self.basepath.glob("Practice *yml"):
            p = read_yaml(f)
            if "shortDescription" not in p:
                continue
            practices[p["shortName"]] = p["name"]
        return practices

    def _parse_streams(self):
        streams = {}
        for f in self.basepath.glob("Stream *yml"):
            s = read_yaml(f)
            s_id = f.name[7:-4]
            s_name = s["name"]
            streams[s_id] = s_name
        return streams

    def parse_activity(self, a):
        function, practice, maturity, stream = a.split("-")
        stream_id = f"{function}-{practice}-{stream}"
        return {
            "id": a,
            "function": self.functions_map[function],
            "practice": self.practices_map[practice],
            "maturity": maturity,
            "stream": self.streams[stream_id],
        }


def test_parse_activities():
    fpath = (
        "/home/rpolli/workspace-py/samm/Supporting Resources/v2.0/Datamodel/Datafiles"
    )
    samm = SammResolver(fpath)
    for a in samm.activities:
        print(samm.parse_activity(a))


def test_samm_to_csv():
    fpath = (
        "/home/rpolli/workspace-py/samm/Supporting Resources/v2.0/Datamodel/Datafiles"
    )
    samm = SammResolver(fpath)
    import pandas as pd

    df = pd.DataFrame([samm.parse_activity(a) for a in samm.activities])
    df.to_csv("samm_activities.csv")
    from sqlalchemy import create_engine

    # engine = create_engine('sqlite:///dsomm.sqlite', echo=False)
    engine = create_engine("mysql+mysqlconnector://root:root@127.0.0.1/dsomm")

    df.to_sql("samm", con=engine)


import pytest

from orm import db as ormdb, Activity, Implementation, load_dsom_activities
from pony.orm import db_session, ObjectNotFound
from orm import Reference


@pytest.fixture
def db():
    ormdb.bind(provider="mysql", host="", user="root", passwd="root", db="dsomm")
    return ormdb


def test_pony_create_drop(db):
    class Test(db.Entity):
        name = Required(str)
        references = Optional(Json)

    db.generate_mapping(create_tables=True)
    db.drop_table(Test)


@pytest.fixture
def dsomm_activities():
    return load_dsom_activities()


def test_pony_populate_activities(db, dsomm_activities):

    for t in ("Activity", "Reference", "Implementation"):
        db.drop_table(t, if_exists=True)
    db.generate_mapping(create_tables=True)
    with db_session:
        for a in dsomm_activities:
            dimension, subdimension, name, data = a
            references = data.pop("references", [])
            level = data.pop("level")
            implementation = data.pop("implementation", None) or []
            implementation = [x.strip() for x in implementation]
            t = Activity(
                dimension=dimension,
                subdimension=subdimension,
                name=name,
                implementation=implementation,
                level=level,
                references=references,
                data=data,
            )
            for i in references:
                if ":" not in i:
                    continue
                reference = i.split(":")[0]
                Reference.get(name=reference) or Reference(name=reference)
            for i in implementation:
                if not i:
                    continue
                i = str(i)
                if len(i) > 64:
                    i=i[:64]
                Implementation.get(name=i) or Implementation(name=i)
