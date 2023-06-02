import React, { useState, useMemo } from "react";
import StudentsPicker from "../components/StudentsPicker";
import StudentsTable from "../components/StudentsTable";
import {
  fetchStudentData,
  fetchSchoolData,
  fetchLegalguardianData,
} from "../utils";
const StudentsDataComponent = () => {
  const [studentIds, setStudentIds] = useState([]);
  const studentsData = useMemo(() => [], []);
  const schoolsData = useMemo(() => [], []);
  const legalguardiansData = useMemo(() => [], []);
  const onStudentsPick = async (selectedStudentIds) => {
    const fetchStudentPromises = selectedStudentIds.map(fetchStudentData);
    const newStudentsData = await Promise.all(fetchStudentPromises);
    const fetchSchoolPromises = newStudentsData.flatMap((studentData) =>
      studentData.map((student) => fetchSchoolData(student.schoolId))
    );
    const newSchoolsData = await Promise.all(fetchSchoolPromises);
    const fetchLegalguardianPromises = newStudentsData.flatMap((studentData) =>
      studentData.map((student) =>
        fetchLegalguardianData(student.legalguardianId)
      )
    );
    const newLegalguardiansData = await Promise.all(fetchLegalguardianPromises);
    setStudentsData((prevStudentsData) => [
      ...prevStudentsData,
      ...newStudentsData,
    ]);
    setSchoolsData((prevSchoolsData) => [
      ...prevSchoolsData,
      ...newSchoolsData,
    ]);
    setLegalguardiansData((prevLegalguardiansData) => [
      ...prevLegalguardiansData,
      ...newLegalguardiansData,
    ]);
  };
  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={studentsData}
        schoolsData={schoolsData}
        LegalguardiansData={legalguardiansData}
      />
    </>
  );
};
export default StudentsDataComponent;
