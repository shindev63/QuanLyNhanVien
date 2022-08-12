
function fnClearInput() {
    document.getElementById("tknv").value = ''
    document.getElementById("name").value = ''
    document.getElementById("email").value = ''
    document.getElementById("password").value = ''
    document.getElementById("datepicker").value = ''
    document.getElementById("luongCB").value = ''
    document.getElementById("chucvu").selectedIndex = 0;
    document.getElementById("gioLam").value = ''
}


var lstEmp = [];
var empId = '';
//Thêm nhân viên
document.getElementById("btnThemNV").onclick = fnAddEmployee;
document.getElementById("btnThem").onclick = function() {
  empId = ''
  fnClearInput()
};


function fnAddEmployee() {
    var gioLam = document.getElementById("gioLam").value*1;
    var performance1 = ''
    if (gioLam >= 192) {
      performance1 = "Xuất sắc"
    }
    else if (gioLam >= 176) {
      performance1 = "Giỏi"
    }
    else if (gioLam >= 160) {
      performance1 = "Khá"
    }
    else {
      performance1 = "Trung bình"
    }
    empId = randomFixedInteger(5)
    var emp = new Employee(
      empId,
      document.getElementById("tknv").value,
      document.getElementById("name").value,
      document.getElementById("email").value,
      document.getElementById("password").value,
      document.getElementById("datepicker").value,
      document.getElementById("luongCB").value*1,
      document.getElementById("chucvu").value,
      document.getElementById("gioLam").value,
      performance1
    );

    if(validate(emp) === false) {
      return;
    }
    
  
   
    
    lstEmp.push(emp)
    renderEmployeeList(lstEmp);
    //thêm vào local storage
    saveLocalStorage(lstEmp, 'arrEmployee');
}

function renderEmployeeList(arrEmp) { 
    var output = '';
    for (var index = 0; index < arrEmp.length; index++) {
      var emp = arrEmp[index];
      emp.totalSalary = function () {
        var sal = 0;
        switch (this.chucvu) {
            case "Giám đốc":
                sal = this.luongCB * 3
                break;
            case "Trưởng phòng":
                sal = this.luongCB * 2
                break;
            default:
                sal = this.luongCB
        }
        return sal;
    };
   
    var str = `
          <tr>
            <td hidden="hidden">${emp.id}</td>
            <td>${emp.userlogin}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.datepicker}</td>
            <td>${emp.chucvu}</td>
            <td>${emp.totalSalary()}</td>
            <td>${emp.performance1}</td>
            <td>
              <button class="btn btn-danger" onclick="delEmployee('${emp.id}')">Del</button>
              <button class="btn btn-primary" onclick="editEmployee('${emp.id}')" data-toggle="modal" data-target="#myModal" >Update</button>
            </td>
          </tr>
        `;
  
      output += str;
    }
    document.getElementById('tableDanhSach').innerHTML = output;
    return output;
}


function delEmployee(idClick) { 
    var indexDel = -1;
    for (var index = lstEmp.length - 1; index >= 0; index--) {
     
      if (lstEmp[index].id == idClick) {
        
        lstEmp.splice(index, 1);
      }
    }
    renderEmployeeList(lstEmp);
  
    saveLocalStorage(lstEmp, 'arrEmployee');
    if (indexDel !== -1) { //tìm thấy
      lstEmp.splice(indexDel, 1);
      //Gọi lại hàm render table mới
      //Lưu danh sách sau khi xoá vào storage
    }
  }


function editEmployee(idClick) {
  var editRow = null;
  for (var index = 0; index < lstEmp.length; index++) {
    if (lstEmp[index].id == idClick) {
      editRow = lstEmp[index];
      break;
    }
  }
  if (editRow !== null) {
    //Đưa dữ liệu lên các control input
    empId = editRow.id
    document.getElementById("tknv").value = editRow.userlogin
    document.getElementById("name").value = editRow.name
    document.getElementById("email").value = editRow.email
    document.getElementById("password").value = editRow.password 
    document.getElementById("datepicker").value = editRow.datepicker 
    document.getElementById("luongCB").value = editRow.luongCB 
    document.getElementById("chucvu").value = editRow.chucvu 
    document.getElementById("gioLam").value = editRow.gioLam 
  }
}

document.getElementById("btnCapNhat").onclick = updateEmp;
//Khi người dùng bấm Lưu thông tin
function updateEmp() {
    var updateEmployee = new Employee();
    updateEmployee.id = empId
    updateEmployee.userlogin =  document.getElementById("tknv").value
    updateEmployee.name = document.getElementById("name").value
    updateEmployee.email = document.getElementById("email").value
    updateEmployee.password = document.getElementById("password").value
    updateEmployee.datepicker = document.getElementById("datepicker").value
    updateEmployee.luongCB = document.getElementById("luongCB").value*1
    updateEmployee.chucvu = document.getElementById("chucvu").value
    updateEmployee.gioLam = document.getElementById("gioLam").value
    validate(updateEmployee)
    //Update xếp loại
    var performance1 = ''
    if (updateEmployee.gioLam >= 192) {
        performance1 = "Xuất sắc"
    }
    else if (updateEmployee.gioLam >= 176) {
      performance1 = "Giỏi"
    }
    else if (updateEmployee.gioLam >= 160) {
      performance1 = "Khá"
    }
    else {
      performance1 = "Trung bình"
    }

    let indexEdit = -1;
    for (var index = 0; index < lstEmp.length; index++) {
      if (lstEmp[index].id === updateEmployee.id) {
        indexEdit = index; //1
        break;
      }
    }
    if (indexEdit !== -1) {
      lstEmp[indexEdit].name = updateEmployee.name;
      lstEmp[indexEdit].email = updateEmployee.email;
      lstEmp[indexEdit].password = updateEmployee.password;
      lstEmp[indexEdit].datepicker = updateEmployee.datepicker;
      lstEmp[indexEdit].luongCB = updateEmployee.luongCB;
      lstEmp[indexEdit].chucvu = updateEmployee.chucvu;
      lstEmp[indexEdit].gioLam = updateEmployee.gioLam;
      lstEmp[indexEdit].performance1 = performance1;
      //Gọi hàm rendertable truyền cho hàm mảng mới
      renderEmployeeList(lstEmp);
    }
}


// searchStudent();hoisting
function searchStudent() {  //expression function(Không hỗ hoisting)
  //input: tuKhoa : string
  var tuKhoa = document.querySelector('#searchName').value; //a
  tuKhoa = removeVietnameseTones(tuKhoa);// nguyễn => nguyen
  //output: ?? []: arraySinhVien
  var output = [];
  //process:
  //B1: duyệt qua từng phần tử của mảng 
  //B2: Kiểm tra tên có chứa từ khoá hay không
  //B3: Nếu có thì đưa object đó vào output
  //                  0        1         2
  // studentList = [{id,name},{id,name},{id,name}]
  for (var index = 0; index < lstEmp.length; index++) {
    // nguyễn văn a.search('a') => 11
    // nguyễn văn b.search('a') => -1
    // nguyễn văn c.search('a') => -1
    var tenSinhVien = removeVietnameseTones(lstEmp[index].performance1);
    if (tenSinhVien.toLowerCase().search(tuKhoa.toLowerCase()) != -1) {
      //Tìm thấy => add object tại vị trí đó vào output
      output.push(lstEmp[index]);
    }
  }
  //Dùng output render ra table
  renderEmployeeList(output);
}
//Dom đến txtSearch cài đặt sự kiện oninput cho nó
document.querySelector('#searchName').oninput = searchStudent;
//Tìm kiếm
document.getElementById('searchName').addEventListener("keypress",function(event){
    if(event.key === "Enter") {
        searchStudent()
    }
});

function validate(emp) {
    var isValid = true;
    document.getElementById("tbTKNV").style.display = 'none'
    document.getElementById("tbTen").style.display = 'none'
    document.getElementById("tbEmail").style.display = 'none'
    document.getElementById("tbMatKhau").style.display = 'none'
    document.getElementById("tbNgay").style.display = 'none'
    document.getElementById("tbLuongCB").style.display = 'none'
    document.getElementById("tbChucVu").style.display = 'none'
    document.getElementById("tbGiolam").style.display = 'none'

    let regNumber = /[^0-9]/g; //Kiểm tra Chỉ có các ký tự số
    let onlyLetter = /^[A-Za-z]+$/;
    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var regPass = new RegExp('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/');
    var regDate = new RegExp('/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/');

    var tempName = removeVietnameseTones(emp.name)
    if(emp.userlogin.trim() === '' || regNumber.test(emp.userlogin.trim()) || document.getElementById("tknv").value.length < 4 || document.getElementById("tknv").value.length > 6) {
        document.getElementById("tbTKNV").innerHTML = '** Tài khoản chỉ được 4-6 ký số, không để trống **'
        document.getElementById("tbTKNV").style.display = 'inline-block'
        isValid = false;
    }

    if(emp.name.trim() === '' || !onlyLetter.test(tempName)) {
        document.getElementById("tbTen").innerHTML = '** Tên nhân viên phải là chữ, không để trống **'
        document.getElementById("tbTen").style.display = 'inline-block'
        isValid = false;
    }

    if(emp.email.trim() === '' || !regEmail.test(emp.email)) {
        document.getElementById("tbEmail").innerHTML = '** Email phải đúng định dạng, không để trống **'
        document.getElementById("tbEmail").style.display = 'inline-block'
        isValid = false;
    }

    if(emp.password.trim() === '' || emp.password.length < 6 || emp.password.length > 10 ||regPass.test(emp.password)) {
        document.getElementById("tbMatKhau").innerHTML = '** Mật Khẩu từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt), không để trống **'
        document.getElementById("tbMatKhau").style.display = 'inline-block'
        isValid = false;
    }
    
    if(emp.datepicker.trim() === '' || regDate.test(regDate.datepicker)) {
        document.getElementById("tbNgay").innerHTML = '** Ngày làm không để trống, định dạng mm/dd/yyyy **'
        document.getElementById("tbNgay").style.display = 'inline-block'
        isValid =  false;
    }
    
    if(emp.luongCB*1 < 1000000 || emp.luongCB*1 > 20000000) {
        document.getElementById("tbLuongCB").innerHTML = '** Lương cơ bản 1 000 000 - 20 000 000, không để trống **'
        document.getElementById("tbLuongCB").style.display = 'inline-block'
        isValid = false;
    }
    if(emp.chucvu.trim() === '' || emp.chucvu === 'Chọn chức vụ') {
        document.getElementById("tbChucVu").innerHTML = '** Chức vụ phải chọn chức vụ hợp lệ **'
        document.getElementById("tbChucVu").style.display = 'inline-block'
        isValid = false;
    }
    if(document.getElementById("gioLam").value.trim() === '' || regNumber.test(emp.gioLam) || emp.gioLam*1 < 80 || emp.gioLam*1 > 200) {
        document.getElementById("tbGiolam").innerHTML = '** Số giờ làm trong tháng 80 - 200 giờ, không để trống **'
        document.getElementById("tbGiolam").style.display = 'inline-block'
        isValid = false;
    }

    return isValid;
}


function saveLocalStorage(ob, key) { // {} , []
  var str = JSON.stringify(ob);
  localStorage.setItem(key, str);
}



function getLocalStorage(key) {
  //Lấy dữ liệu từ localstorage ra (dữ liệu lấy là string)
  if (localStorage.getItem(key)) {
    var str = localStorage.getItem(key);
    //Parse dữ liệu về lại object
    var ob = JSON.parse(str);
    return ob;
  }
  return undefined;
}


//đợi html js load xong thì sẽ động thực thi
window.onload = function () {
  
  lstEmp = getLocalStorage('arrEmployee');
  if (lstEmp == undefined) {
    lstEmp = [];
  }
 
  renderEmployeeList(lstEmp);
}