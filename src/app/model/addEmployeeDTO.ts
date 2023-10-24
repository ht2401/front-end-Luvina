/**
 * AddEmployeeDTO: Dùng để chứa dữ liệu khi thêm thông tin nhân viên mới.
 * @author hathang
 */
import { EmployeeCertificationDTO } from "./employeeCertification";
  // model để chứa các dữ liệu khi thêm employee
export interface AddEmployeeDTO {
    employeeName: string;
    employeeBirthDate: string;
    employeeEmail: string;
    employeeTelephone: string;
    employeeNameKana: string;
    employeeLoginId: string;
    employeeLoginPassword: string;
    departmentId: number;
    certifications: EmployeeCertificationDTO[];
  }