import type { DocumentDefinition } from "@/lib/types";

/** 在职证明正文字段值占位：有值用值，无值用字段英文标签占位。 */
function val(values: Record<string, string>, id: string, label: string): string {
  const raw = values[id]?.trim();
  if (raw) return raw;
  return `[${label}]`;
}

function buildBody(values: Record<string, string>): string {
  const name = val(values, "employeeName", "Employee Name");
  const passport = val(values, "passportNumber", "Passport Number");
  const company = val(values, "companyName", "Company Name");
  const jobTitle = val(values, "jobTitle", "Job Title");
  const department = val(values, "department", "Department");
  const dateOfEmployment = val(values, "dateOfEmployment", "Date of Employment");
  const monthlySalary = val(values, "monthlySalary", "Monthly Salary");
  const annualSalary = values["annualSalary"]?.trim();
  const leaveStart = val(values, "leaveStartDate", "Leave Start Date");
  const leaveEnd = val(values, "leaveEndDate", "Leave End Date");
  const destination = val(values, "destination", "Destination");
  const purpose = val(values, "purposeOfTravel", "Purpose of Travel");
  const telephone = val(values, "companyTelephone", "Company Telephone");

  const salaryLine = annualSalary
    ? `monthly salary of ${monthlySalary} (annual salary: ${annualSalary})`
    : `monthly salary of ${monthlySalary}`;

  return [
    `This is to certify that ${name} (Passport No.: ${passport}) is a full-time employee of ${company}, holding the position of ${jobTitle} in the ${department} department. The employee joined the company on ${dateOfEmployment} and currently receives a ${salaryLine}.`,

    `We confirm that ${name} has been granted leave from ${leaveStart} to ${leaveEnd} for the purpose of traveling to ${destination} for ${purpose}. Upon completion of the trip, the employee is expected to resume duties and will remain employed by our company during and after the period of travel.`,

    `Should you require any further information, please do not hesitate to contact us at ${telephone}.`,
  ].join("\n\n");
}

export const employmentCertificate: DocumentDefinition = {
  type: "employment-certificate",
  titleZh: "在职证明",
  titleEn: "Employment Certificate",
  descriptionZh: "适用于在职人员签证材料。",
  pdfTitleEn: "Employment Certificate",
  fileName: "Employment-Certificate",
  kind: "generated",
  generated: {
    bodyLabelEn: "Employment Letter",
    defaultBody: buildBody,
  },
  sections: [
    {
      id: "employee",
      labelZh: "员工信息",
      labelEn: "Employee Information",
      fields: [
        {
          id: "employeeName",
          labelZh: "员工姓名",
          labelEn: "Employee Name",
          type: "text",
          translationMode: "none",
          hint: "填写护照上的英文姓名，如 ZHANG SAN。",
        },
        {
          id: "passportNumber",
          labelZh: "护照号码",
          labelEn: "Passport Number",
          type: "text",
          translationMode: "none",
        },
        {
          id: "jobTitle",
          labelZh: "职位",
          labelEn: "Job Title",
          type: "text",
          translationMode: "none",
          hint: "例如：Senior Software Engineer。",
        },
        {
          id: "department",
          labelZh: "部门",
          labelEn: "Department",
          type: "text",
          translationMode: "none",
        },
        {
          id: "dateOfEmployment",
          labelZh: "入职日期",
          labelEn: "Date of Employment",
          type: "date",
          translationMode: "none",
        },
      ],
    },
    {
      id: "salary",
      labelZh: "薪资与休假",
      labelEn: "Salary & Leave",
      fields: [
        {
          id: "monthlySalary",
          labelZh: "月薪",
          labelEn: "Monthly Salary",
          type: "text",
          translationMode: "none",
          hint: "例如：RMB 25,000。",
        },
        {
          id: "annualSalary",
          labelZh: "年薪（可选）",
          labelEn: "Annual Salary (optional)",
          type: "text",
          translationMode: "none",
        },
        {
          id: "leaveStartDate",
          labelZh: "休假开始日期",
          labelEn: "Leave Start Date",
          type: "date",
          translationMode: "none",
        },
        {
          id: "leaveEndDate",
          labelZh: "休假结束日期",
          labelEn: "Leave End Date",
          type: "date",
          translationMode: "none",
        },
        {
          id: "destination",
          labelZh: "旅行目的地",
          labelEn: "Destination",
          type: "text",
          translationMode: "none",
          hint: "例如：United Kingdom。",
        },
        {
          id: "purposeOfTravel",
          labelZh: "旅行目的",
          labelEn: "Purpose of Travel",
          type: "text",
          translationMode: "none",
          hint: "例如：Tourism / Visiting family。",
        },
      ],
    },
    {
      id: "company",
      labelZh: "公司信息",
      labelEn: "Company Information",
      fields: [
        {
          id: "companyName",
          labelZh: "公司名称",
          labelEn: "Company Name",
          type: "text",
          translationMode: "none",
          fullWidth: true,
        },
        {
          id: "companyAddress",
          labelZh: "公司地址",
          labelEn: "Company Address",
          type: "textarea",
          translationMode: "none",
          fullWidth: true,
        },
        {
          id: "companyTelephone",
          labelZh: "公司电话",
          labelEn: "Company Telephone",
          type: "text",
          translationMode: "none",
          inputMode: "tel",
        },
      ],
    },
    {
      id: "issuance",
      labelZh: "签署信息",
      labelEn: "Signing Information",
      fields: [
        {
          id: "hrManagerName",
          labelZh: "HR / 负责人姓名",
          labelEn: "HR / Manager Name",
          type: "text",
          translationMode: "none",
        },
        {
          id: "hrManagerPosition",
          labelZh: "HR / 负责人职位",
          labelEn: "HR / Manager Position",
          type: "text",
          translationMode: "none",
        },
        {
          id: "issueDate",
          labelZh: "签发日期",
          labelEn: "Issue Date",
          type: "date",
          translationMode: "none",
        },
      ],
    },
  ],
};
