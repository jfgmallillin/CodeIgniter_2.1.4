<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
    
    class Post extends CI_Controller{
        
        public function __construct() {
            parent::__construct();
        }
        
        public function comment(){
            $this->load->model('comments_model');
            $this->comments_model->addComment();
        }
    }
?>
