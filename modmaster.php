<?php
/**
 * Created by PhpStorm.
 * User: mruescher
 * Date: 23/02/15
 * Time: 23:44
 */

//var_dump($argv);

class Modmaster {

    public static $MODMASTERDIR = "modmaster/";
    public static $LINKDIR      = "htdocs/";


    public function deploy() {
        $modules = scandir(self::$MODMASTERDIR);
        foreach($modules as $module) {
            if(strpos($module, '.') === 0) continue;

            $it = new RecursiveDirectoryIterator( self::$MODMASTERDIR . $module );
            foreach(new RecursiveIteratorIterator($it) as $file) {
                if(strpos($file, '.') === 0) continue;
                if(is_file($file)) {

                    echo $file . "\n";
                    $linkToDir =  self::$LINKDIR . substr($file, strlen(self::$MODMASTERDIR)) . "\n";

                    symlink($file, $linkToDir);
                }
            }
        }

    }

}
$obj = new Modmaster();

if( isset($argv[1]) ) {
    $obj->$argv[1]();
}
