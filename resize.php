<?php

## for debugging purpose
//ini_set('display_errors', 'On');
//error_reporting(E_ALL);

class ImageMinimizer{
    
    public $file;
    public $dst;
    public $mime;
    public $generateImage;

    public function __construct($file){
        $this->file = $file; 
           
    }

    public function resize_image($w, $h, $crop=FALSE) {
        $file = $this->file;
        
        list($width, $height) = getimagesize($file);
        $r = $width / $height;
        if ($crop) {
            if ($width > $height) {
                $width = ceil($width-($width*abs($r-$w/$h)));
            } else {
                $height = ceil($height-($height*abs($r-$w/$h)));
            }
            $newwidth = $w;
            $newheight = $h;
        } else {
            if ($w/$h > $r) {
                $newwidth = $h*$r;
                $newheight = $h;
            } else {
                $newheight = $w/$r;
                $newwidth = $w;
            }
        }



        switch($mime = exif_imagetype($file)){
            case IMAGETYPE_PNG: 
                $src = imagecreatefrompng($file);
                 $this->generateImage = 'imagepng';
            break;
            case IMAGETYPE_JPEG : 
                $src = imagecreatefromjpeg($file);
                $this->generateImage = 'imagejpeg';
            break;
            case IMAGETYPE_GIF: 
                $src = imagecreatefromgif($file);
                $this->generateImage = 'imagegif';
            break;
        }


        $dst = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        $this->dst = $dst;
        $this->mime = $mime;
        
        return $this;
    }

    public function render(){
        header('Content-type:'.image_type_to_mime_type($this->mime));
        $func = $this->generateImage;
        $func($this->dst);
    }
}



$mini = new ImageMinimizer($_GET['file']);
$mini->resize_image(40,40)->render();
