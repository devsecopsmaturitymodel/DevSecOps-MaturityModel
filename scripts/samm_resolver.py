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

from orm import db as ormdb, Activity, Implementation, create_database
from pony.orm import db_session, ObjectNotFound
from orm import Reference


@pytest.fixture(scope='session')
def db():
    ormdb.bind(provider="mysql", host="", user="root", passwd="root", db="dsomm")
    return ormdb


@pytest.fixture(autouse=True, scope="session")
def setup(db):
    create_database()

def test_pony_populate_activities(db):
    with db_session:
        tables = db.execute("SHOW TABLES;")
        assert ('activity',) in tables.fetchall()

queries = yaml.safe_load(Path("scripts/mysql-queries.yaml").read_text())

def test_overview(db):
    with db_session:
        overview = db.execute(queries['overview'])
        from collections import defaultdict
        ret = defaultdict(dict)
        for dimension, subdimension, level, activity in overview:
            k = dimension+"-"+subdimension
            if level not in ret[k]:
                l = ret[k][level] = []
            l.append(activity)
    assert "Building and testing of artifacts in virtual environments" in ret["BuildAndDeployment-Build"][2]

def test_overview_count(db):
    with db_session:
        overview = db.execute(queries['activities-per-dimension'])
        assert ('BuildAndDeployment', 'Build', 4) in overview


def test_mapping_samm2(db):
    with db_session:
        overview = db.execute(queries['overview'])
        raise NotImplementedError

def test_mapping_iso(db):
    with db_session:
        overview = db.execute(queries['overview'])
        raise NotImplementedError

def test_references_1(db):
    with db_session:
        overview = db.execute(queries['activity-references-unique'])
        raise NotImplementedError

def test_samm2_dive_1(db):
    with db_session:
        overview = db.execute(queries['activity-samm'])
        raise NotImplementedError

def test_samm2_dive_2(db):
    with db_session:
        overview = db.execute(queries['samm-unused-entries'])
        raise NotImplementedError
