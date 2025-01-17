#!/usr/bin/env python3

import re
import yaml

def parse_meta_yaml(meta_file_path):
    """Parse the meta.yaml file and extract the teams array."""
    with open(meta_file_path, 'r') as meta_file:
        meta_data = yaml.safe_load(meta_file)
    return meta_data['teams']

def generate_teams_implemented(teams):
    """Generate the teamsImplemented block dynamically."""
    return "\n".join([f"        {team}: false" for team in teams])

def update_generated_yaml(input_file_path, output_file_path, teams_block):
    """Update the generated.yaml file by replacing the teamsImplemented blocks."""
    with open(input_file_path, "r") as input_file:
        content = input_file.read()

    # Regex: find lines under 'teamsImplemented:'
    pattern = r"teamsImplemented:\n(?:\s{2,}\w+:\s\w+\n?)+"
    replacement_block = f"teamsImplemented:\n{teams_block}\n"

    updated_content = re.sub(pattern, replacement_block, content)

    with open(output_file_path, "w") as output_file:
        output_file.write(updated_content)

if __name__ == "__main__":
    meta_file = "/app/meta.yaml"
    generated_file = "/app/generated.yaml"
    updated_file = "/mnt/out/updated.yaml"

    # Extract teams
    teams_array = parse_meta_yaml(meta_file)

    # Generate replacement
    teams_implemented_block = generate_teams_implemented(teams_array)

    # Do the replacement
    update_generated_yaml(generated_file, updated_file, teams_implemented_block)

    print(f"Updated YAML has been saved to {updated_file}")
