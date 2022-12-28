function display_image(file){
    let allowed = ['jpg','jpeg','png'];
    let ext = file.name.split(".").pop();
	if(allowed.includes(ext.toLowerCase())){
        document.querySelector('.js-add-image').src = URL.createObjectURL(file);
		image_added = true;
	}else{
        alert("Only the following image types are allowed:"+ allowed.toString(", "));
	}
}

function display_edit_image(file){
    let allowed = ['jpg','jpeg','png'];
    let ext = file.name.split(".").pop();
	if(allowed.includes(ext.toLowerCase())){
        document.querySelector('.js-edit-image').src = URL.createObjectURL(file);
		image_added = true;
	}else {
		alert("Only the following image types are allowed:"+ allowed.toString(", "));
	}
}

var image_added = false;

	const addModal = new bootstrap.Modal('#add-new-modal', {});
	const editModal = new bootstrap.Modal('#edit-new-modal', {});
	const viewModal = new bootstrap.Modal('#view-new-modal', {});

	send_data({},'read');

	function send_data(obj, type)
	{
		var form = new FormData();
		for(key in obj)
		{
			form.append(key,obj[key]);
		}

		form.append('data_type',type);

		var ajax = new XMLHttpRequest();

		ajax.addEventListener('readystatechange',function(){

			if(ajax.readyState == 4)
			{
				if(ajax.status == 200)
				{
					handle_result(ajax.responseText);

				}else{
					alert("an error occured");
				}
			}
		});

		ajax.open('post','api.php',true);
		ajax.send(form);
	}

	function handle_result(result)
	{
		
		//console.log(result);
		var obj = JSON.parse(result);
		if(typeof obj == 'object')
		{
			if(obj.data_type == 'read')
			{
				let tbody = document.querySelector(".js-table-body");
				let str = "";

				if(typeof obj.data == 'object')
				{
					for (var i = 0; i < obj.data.length; i++) {
						
						let row = obj.data[i];
						str += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td><td>${row.age}</td><td><img onclick="get_view_row(${row.id});viewModal.show()" src="${row.image}" style="width:70px;height: 70px;object-fit: cover;cursor:pointer" /></td><td>${row.city}</td>
						<td>
							<button onclick="get_view_row(${row.id});viewModal.show()" class="btn btn-primary btn-sm">View</button>
							<button onclick="get_edit_row(${row.id});editModal.show()" class="btn btn-primary btn-sm">Edit</button>
							<button onclick="delete_row(${row.id})" class="btn btn-danger btn-sm">Delete</button>
						</td>
						</tr>`;
					}
				}else
				{
					str = "<tr><td>No records found!</td></tr>";
				}

				tbody.innerHTML = str;
			}else
			if(obj.data_type == 'save')
			{
				alert(obj.data);
				send_data({},'read');
			}else
			if(obj.data_type == 'edit')
			{
				alert(obj.data);
				send_data({},'read');
			}else
			if(obj.data_type == 'delete')
			{
				alert(obj.data);
				send_data({},'read');
			}else
			if(obj.data_type == 'get-edit-row')
			{
				let row = obj.data;
				
				if(typeof row == 'object')
				{
					let myModal = document.querySelector("#edit-new-modal");
					for (key in row)
					{
						if(key == "image")
							document.querySelector(".js-edit-image").src = row[key];

						let input = myModal.querySelector("#"+key);
						if(input != null)
						{
							if(key != "image")
								input.value = row[key];
						}
					}
				}
			}else
			if(obj.data_type == 'get-view-row')
			{
				let row = obj.data;
				
				if(typeof row == 'object')
				{
					let myModal = document.querySelector("#view-new-modal");
					for (key in row)
					{
						if(key == "image")
							document.querySelector(".js-view-image").src = row[key];

						let input = myModal.querySelector("#"+key);
						if(input != null)
						{
							if(key != "image")
								input.innerHTML = row[key];
						}
					}
				}
			}

		}
	}

	function add_new(e)
	{
		e.preventDefault();

		//validate 
		if(!image_added)
		{
			alert("An image is required");
			return;
		}


		let obj = {};
		let inputs = e.currentTarget.querySelectorAll("input,select,textarea");

		for (var i = 0; i < inputs.length; i++) {

			if(inputs[i].type == 'file' && image_added)
			{
				obj[inputs[i].id] = inputs[i].files[0];
			}else{
				obj[inputs[i].id] = inputs[i].value;
			}
			
			inputs[i].value = "";
		}

		image_added = false;
		document.querySelector(".js-add-image").src = "images/user.png";

		send_data(obj,'save');
		addModal.hide();

	}

	function edit_row(e)
	{
		e.preventDefault();

		let obj = {};
		let inputs = e.currentTarget.querySelectorAll("input,select,textarea");

		for (var i = 0; i < inputs.length; i++) {

			if(inputs[i].type == 'file' && image_added)
			{
				obj[inputs[i].id] = inputs[i].files[0];
			}else{
				obj[inputs[i].id] = inputs[i].value;
			}
			
			inputs[i].value = "";
		}

		image_added = false;
		document.querySelector(".js-add-image").src = "images/user.png";

		send_data(obj,'edit');
		editModal.hide();

	}

	function delete_row(id)
	{

		if(!confirm("Are you sure you want to delete row number "+id+"?!"))
		{
			return;
		}

		send_data({id:id},'delete');
	}

	function get_edit_row(id)
	{
		send_data({id:id},'get-edit-row');
	}

	function get_view_row(id)
	{
		send_data({id:id},'get-view-row');
	}

