<?php


function query($query)
{

	$res = false;
	if(!$con = mysqli_connect('localhost','root','','spreadsheet_db'))
	{
		die("unable to connect!");
	}

	$result = mysqli_query($con, $query);
	if(!is_bool($result))
	{
		if(mysqli_num_rows($result) > 0)
		{
			while ($row = mysqli_fetch_assoc($result)) {
				
				$res[] = $row;
			}
		}
	}

	return $res;
}


if(count($_POST) > 0)
{
	$info  = [];
	$info['data_type'] = $_POST['data_type'];

	if($_POST['data_type'] == 'read')
	{

		$query 			= "select * from users order by id desc";
		$result 		= query($query);
		$info['data'] 	= $result;

	}else
	if($_POST['data_type'] == 'get-edit-row')
	{
		$id = (int)$_POST['id'];

		$query 			= "select * from users where id = '$id' limit 1";
		$result 		= query($query);
		$info['data'] 	= false;
		
		if($result)
			$info['data'] 	= $result[0];

	}else
	if($_POST['data_type'] == 'get-view-row')
	{
		$id = (int)$_POST['id'];

		$query 			= "select * from users where id = '$id' limit 1";
		$result 		= query($query);
		$info['data'] 	= false;
		
		if($result)
			$info['data'] 	= $result[0];

	}else
	if($_POST['data_type'] == 'delete')
	{
		$id = (int)$_POST['id'];

		$query 			= "delete from users where id = '$id' limit 1";
		$result 		= query($query);
		$info['data'] 	= "Record deleted!!";

	}else
	if($_POST['data_type'] == 'save')
	{

		$image = "";

		//check for an image
		if(!empty($_FILES['image']['name']))
		{
			$allowed = ['image/jpeg','image/png'];

			if(in_array($_FILES['image']['type'], $allowed))
			{

				$folder = "uploads/";
				if(!file_exists($folder))
				{
					mkdir($folder,0777,true);
				}

				$path = $folder . time() . $_FILES['image']['name'];
				move_uploaded_file($_FILES['image']['tmp_name'], $path);
				
				$image = $path;
			}

		}

		$name 	= addslashes($_POST['name']);
		$age 	= addslashes($_POST['age']);
		$image 	= $image;
		$email 	= addslashes($_POST['email']);
		$city 	= addslashes($_POST['city']);
		$date_created 	= date("Y-m-d H:i:s");

		$query 			= "insert into users (name,age,image,email,city,date_created) values ('$name','$age','$image','$email','$city','$date_created')";
		$result 		= query($query);
		$info['data'] 	= "Record was saved!";

	}else
	if($_POST['data_type'] == 'edit')
	{

		$image = "";

		//check for an image
		if(!empty($_FILES['image']['name']))
		{
			$allowed = ['image/jpeg','image/png'];

			if(in_array($_FILES['image']['type'], $allowed))
			{

				$folder = "uploads/";
				if(!file_exists($folder))
				{
					mkdir($folder,0777,true);
				}

				$path = $folder . time() . $_FILES['image']['name'];
				move_uploaded_file($_FILES['image']['tmp_name'], $path);
				
				$image = $path;
			}

		}


		$id 	= (int)$_POST['id'];
		$name 	= addslashes($_POST['name']);
		$age 	= addslashes($_POST['age']);
		$image 	= $image;
		$email 	= addslashes($_POST['email']);
		$city 	= addslashes($_POST['city']);
		$date_updated 	= date("Y-m-d H:i:s");

		if(empty($image))
		{
			$query = "update users set name = '$name',age = '$age',email = '$email',city = '$city', date_updated = '$date_updated' where id = '$id' limit 1";
		}else
		{
			$query = "update users set name = '$name',age = '$age',image = '$image',email = '$email',city = '$city', date_updated = '$date_updated' where id = '$id' limit 1";
		}
		
		$result 		= query($query);
		$info['data'] 	= "Record was edited!";

	}

	echo json_encode($info);
}
