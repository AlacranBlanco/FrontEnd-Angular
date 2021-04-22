import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(){
    this.getEmployees(); 
  }

  public getEmployees(){
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm){
    document.getElementById("add-employee-form").click();
    this.employeeService.addEmployees(addForm.value).subscribe(
      (response: Employee) => {
        this.employees.push(response);
        addForm.reset();
      },
      (err: HttpErrorResponse) => {
        alert(err.message);
        addForm.reset();
      }
    )
  }

  public onUpdateEmployee(employee: Employee){
    this.employeeService.aupdateEmployees(employee).subscribe(
      (response: Employee) => {
        this.employees = this.employees.map(item => item.employeeCode === employee.employeeCode ? employee: item);
      },
      (err: HttpErrorResponse) => {
        alert(err.message);
      }
    )
  }

  public onDeleteEmployee(employee: Employee){
    this.employeeService.deleteEmployees(employee.id).subscribe(
      (response: void) => {
        this.employees = this.employees.filter(item => item.employeeCode != employee.employeeCode);
      },
      (err: HttpErrorResponse) => {
        alert(err.message);
      }
    )
  }

  public searchEmployee(key: string){
    const results: Employee[] = [];
    for(const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
         employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
         employee.phoneNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
         employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      } 
    }

    this.employees = results;

    if(results.length === 0 || !key) {
      this.getEmployees();
    }

  }

  public onOpenModal(employee: Employee, mode: string){
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = "button";
    button.style.display = "none";
    button.setAttribute("data-toggle", "modal");

    switch (mode) {
      case "add":
        button.setAttribute("data-target", "#addEmployeeModal");
        break;
      case "update":
        button.setAttribute("data-target", "#updateEmployeeModal");
        this.editEmployee = employee;
        break;
      case "delete":
        button.setAttribute("data-target", "#deleteEmployeeModal");
        this.deleteEmployee = employee;
        break;
      default:
        break;
    }

    container.appendChild(button);
    button.click();
  }


}
