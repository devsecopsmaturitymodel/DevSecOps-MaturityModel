
def convert(path_to_read,path_to_write):
    
    # Define data
    data = {
        "dimension":{
            "name":[],
            "subdimension":{
                "name":[],
            }
        }
    }

    # Read YAML file
    with open(path_to_read, 'r') as stream:
        data_loaded = yaml.safe_load(stream)

    dim =list(data_loaded.keys()) # Dimension
    subdim = list(data_loaded[dim[0]].keys()) # Sub Dimension
    tasks = list(data_loaded[dim[0]][subdim[0]].keys()) # task list

    max=0 # maximum level
    for i in tasks:
        try:
            if(data_loaded[dim[0]][subdim[0]][i]["level"]>max):
                max=data_loaded[dim[0]][subdim[0]][i]["level"]
        except:
            print("Level element does not exist for task :" +i)
    

    for i in range(1,max+1):
        temp = "level-"+str(i)
        data['dimension']['subdimension'][temp]=[]

    data['dimension']['name']=dim[0]
    data['dimension']['subdimension']['name']=subdim[0]

    index=[0]*max
    for i in tasks:
        task_data={}
        try:
            curr_lvl = data_loaded[dim[0]][subdim[0]][i]["level"]
            curr_lvl_in_string = "level-"+str(curr_lvl)
            #print(curr_lvl-1)
            task_data['name']=i
            task_data= data_loaded[dim[0]][subdim[0]][i]|task_data
            data['dimension']['subdimension'][curr_lvl_in_string].append(task_data)
            index[curr_lvl-1]+=1
        except:
            print("Level value is required")
        

    # Write YAML file
    with io.open(path_to_write, 'w', encoding='utf8') as outfile:
        yaml.dump(data, outfile, default_flow_style=False, allow_unicode=True)

if __name__ == "__main__":
    import os, glob
    import yaml
    import io

    path = os.getcwd()+'/data'
    available_paths=[]
    for dir, sub_dirs, files in os.walk(path):
        if(len(files)>0):
            for i in files:
                new_path=dir+'/'+i
                new_path_without_cwd= new_path.replace(path,"")
                path_to_write_in=os.getcwd()+'/generated'+new_path_without_cwd.replace('/'+i,"")
                print(path_to_write_in+'/'+i)
                if not os.path.exists(path_to_write_in):
                    os.makedirs(path_to_write_in)
                convert(new_path,path_to_write_in+'/'+i)
                

    