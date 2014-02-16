<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Findaway extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function index() {
//        if (($this->session->userdata('user_name') == "")) {
//        }
        $this->load->view('header_view');
        $this->load->view('fromto');
        $this->load->view('footer_view');
    }

    public function route() {
        $this->load->model('locref_model');
        $this->load->model('route_model');
        $this->load->model('suggestion_model');
        $this->load->model('user_model');


        $from = $this->locref_model->getId($this->input->post('from'));
        $to = $this->locref_model->getId($this->input->post('to'));
        $routeid = $this->route_model->getRouteId($from, $to);
        if ($routeid != -1) {
            $query = $this->suggestion_model->getAllSuggestions($routeid);
            if($query->num_rows() > 0){
                $data = array();
                foreach($query->result() as $row){
                    $query2 = $this->user_model->getUser($row->USER_ID);
                    if($query2->num_rows() > 0){
                        foreach ($query2->result() as $user){
                            $data[] = array('ID'            =>  $row->ID,
                                            'USERNAME'      =>  $user->username,
                                            'TITLE'         =>  $row->TITLE,
                                            'DATE_CREATED'  =>  $row->DATE_CREATED,
                                            'RATING'        =>  $row->RATING_AVE,
                                            'CONTENT'       =>  $row->CONTENT);
                        }
                    }
                    
                }
                echo json_encode($data);
            }else{
                //if registered user, create own suggestion for specific route combination
                echo "<p>No Results Found.</p>" . anchor('#','Suggest?');
            }
//            $keyword = "Ban";
//            $query = $this->locref_model->lookup($keyword); //Search DB
//            if ($query->num_rows() > 0) {
//                $data = array();
//                foreach ($query->result() as $row) {
//                    $data[] = array('label' => $row->NAME, 'value' => $row->NAME, 'id' => $row->ID . '_' . $row->ID_VARIANT); //Add a row to array
//                }
//            } else {
//                $data = array();
////            $data[] = array('label' => 'No Results Found', 'value' => 'No Results Found', 'id' => 'No Results Found'); //Add a row to array
//            }
//            echo json_encode($data);
        } else {
            //suggest new route combination
            echo "<p>Route combination not yet available. Send as a suggestion? " . anchor('search/newroute/?from=' . $from . '&to=' . $to, 'yes');
        }
    }

}

?>
