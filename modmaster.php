<?php

class Modmaster {

    /**
     * @var string - the directory where the modules are located
     */
    public static $MODMASTERDIR = "modmaster";
    /**
     * @var string - the directory where the modules are going to deployed
     */
    public static $LINKDIR      = "htdocs";
    /**
     * @var string - the config file for the module order
     */
    public static $CONFIGFILE   = "modmaster/modmaster.ini";

    /**
     * @param {String} $dirPath
     * delete whole directory recursively and create a new afterwards
     */
    private function truncateDir($dirPath) {
        if(file_exists($dirPath) && is_dir($dirPath)){
            foreach(
                new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($dirPath, FilesystemIterator::SKIP_DOTS),
                RecursiveIteratorIterator::CHILD_FIRST
            ) as $path) {
                $path->isDir() && !$path->isLink() ? rmdir($path->getPathname()) : unlink($path->getPathname());
            }
            rmdir($dirPath);
        }
        mkdir(self::$LINKDIR);
    }

    /**
     * @param {String} $absSourcePath
     * @param {String} $destinationPath
     * create symlink (for mac and windows)
     */
    private function symlink($absSourcePath, $destinationPath) {
        // make symlinks always absolute on windows because of #142
        if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
            $absSourcePath = str_replace('/', '\\', $absSourcePath);
            $param = is_dir($absSourcePath) ? ' /D' : '';
            exec('mklink' . $param . ' "' . $destinationPath . '" "' . $absSourcePath . '"');
        } else {
            symlink($absSourcePath, $destinationPath);
        }
    }

    /**
     * @param {String} $src
     * @param {String} $dst
     * link all files in given directory recursively
     */
    private function recurse_link($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst);
        while(false !== ( $file = readdir($dir)) ) {
            if (( $file != '.' ) && ( $file != '..' )) {
                if ( is_dir($src . '/' . $file) ) {
                    $this->recurse_link($src . '/' . $file, $dst . '/' . $file);
                } else {
                    if( file_exists($dst . '/' . $file) ){
                        echo "  - overwriting file '$dst/$file' \n";
                        unlink($dst . '/' . $file);
                    }
                    $this->symlink(realpath($src . '/' . $file), $dst . '/' . $file);

                }
            }
        }
        closedir($dir);
    }

    /**
     * get modules and if the ini-file exists in the given order
     * @return array
     */
    private function getModuleOrder() {
        $modules = array();
        try {
            $data = parse_ini_file( self::$CONFIGFILE );
            $modules = $data['modules'];
        } catch(Exception $e) {
            $modules = scandir(self::$MODMASTERDIR);
        }
        return $modules;
    }


    /**
     * @param {String} - the option that defines if the whole link directory
     *                   is going to completely deleted or just cleaned up
     * method to truncate/clean the link directory and deploy all modules
     */
    public function deploy_all( $option ) {
        if( $option == '--delete' )
            $this->truncateDir( self::$LINKDIR );
        else
            $this->clean();
        foreach( $this->getModuleOrder()  as $module) {
            $this->deploy( $module );
        }
    }

    /**
     * method to clean the link directory
     */
    public function clean() {
        foreach(
            new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(self::$LINKDIR, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        ) as $path) {
            // check if the path if a file an if the symlink is broken
            if( $path->isLink() && !file_exists($path->getPathname()) ) {
                unlink($path->getPathname());
            }
        }
    }

    /**
     * @param $moduleName
     * method to deploy only one module and clean up the project afterwards
     */
    public function deploy( $moduleName ) {
        $moduleDir = self::$MODMASTERDIR . DIRECTORY_SEPARATOR . $moduleName;
        if ( file_exists($moduleDir)
            && ($moduleName != '.' )
            && ($moduleName != '..')
            && (is_dir($moduleDir))
        ) {
            echo "Deploying module '$moduleName' \n";
            $this->recurse_link( $moduleDir, self::$LINKDIR);
        } else {
            echo "module '$moduleName' does not exist, or is not located in the modmaster diretory \n";
        }
        $this->clean();
    }

}

$obj = new Modmaster();

if( isset($argv[1]) ) {
    $method = $argv[1];
    if( method_exists($obj, $method) )
        $obj->$method( $argv[2] );
    else if( method_exists($obj, ($method = str_replace('-', '_', $method))) )
        $obj->$method( $argv[2] );
    else
        ?>

modmaster method '<?php echo $method ?>' does not exist !!1

Maybe you should use some of these methods:
    - clean                             // clean up the link diretory an delete all broken symlinks
    - deploy {{module-name}}            // deploy a specific module
    - deploy-all (optional --delete)    // deploy all modules which are located in the modmaster directory
                                        // (use --delete to truncate the link folder before deploying)

<?php
}
