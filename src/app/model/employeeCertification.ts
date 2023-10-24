/**
 * EmployeeCertificationDTO: Dùng để chứa dữ liệu của chứng chỉ của nhân viên.
 * @author hathang
 */export interface EmployeeCertificationDTO {
    certificationId: number;
    certificationName: string;
    certificationStartDate: string;
    certificationEndDate: string;
    employeeCertificationScore: number;
  }