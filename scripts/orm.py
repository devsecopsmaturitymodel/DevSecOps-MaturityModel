from pony.orm import Database, Json, Optional, PrimaryKey, Required, db_session
import yaml
from pathlib import Path

db = Database()

class Activity(db.Entity):
    dimension = Required(str)
    subdimension = Required(str)
    name = Required(str)
    level = Optional(int)
    data = Optional(Json)
    references = Optional(Json)
    implementation = Optional(Json)
    done = Required(int, default=0)
    PrimaryKey(dimension, subdimension, name)

class Implementation(db.Entity):
    name = PrimaryKey(str)
    description = Optional(str)

class Reference(db.Entity):
    name = PrimaryKey(str)
    description = Optional(str)


def load_dsom_activities():
    dimensions = yaml.safe_load(Path("data/dimensions.yaml").read_text())
    activities = [
        (
            dimension,
            subdimension,
            activity,
            data,
        )
        for dimension, v in dimensions.items()
        if not dimension.startswith("_")
        for subdimension, activity_d in v.items()
        if not subdimension.startswith("_")
        for activity, data in activity_d.items()
        if not activity.startswith("_")
    ]
    return activities
