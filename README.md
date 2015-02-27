# module-master
a little command line tool for every project with different module dependencies

##Getting started

With modmaster you can handle your different project modules very easily.
When youre adding a new module to your project, you have to add this to your configuration file (modmaster/modmaster.ini).
In that configuration file you can define the priority of your modules. Through the order you can define which module is allowed to overwrite the previous ones.

```ini
; sample core module
modules[] = mainModule
; first own created module that overrides the core in some cases
modules[] = 1module
; second own created module that overrides mainModule and 1module
modules[] = mysupermodule
```

##Usage

### Mac
- open your terminal
- navigate to the directory, where you installed module-master
- and type :
```bash
$ sh modmaster.sh deploy-all
```

### Windows
- open your cmd as administrator 
- navigate to the directory, where you installe module-master
- and type : 
```cmd
modmaster deploy-all
```
