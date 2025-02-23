# Generated YAML Files

This folder contains the `generated.yaml` file, which is dynamically created during the build process.  
It stores configuration settings and other automatically generated data used by the DevSecOps Maturity Model (DSOMM).  

## **What is `generated.yaml`?**

- It is a machine-generated file that is **not meant to be manually edited**.
- It helps in **storing configuration settings**, which are loaded at runtime.
- Used by the application to dynamically configure settings.

## **How is it Generated?**

The `generated.yaml` file is created as part of the DevSecOps Maturity Model’s **build process**. If you don’t see this file after setup, make sure to run:  

```sh
npm run build
```

or

```sh
yarn build
```

This will generate the required **YAML** file.
