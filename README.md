# YPMReactTask


To optimize the code and avoid unnecessary React re-renders, you can make the following
modifications:

Consolidate state updates: Instead of updating the state for each fetched data item, you can
accumulate the fetched data in temporary variables and update the state once at the end. This
way, you'll only trigger a single re-render for each set state operation

Use functional updates: When updating the state that depends on the previous state, it's
recommended to use functional updates. This ensures that the state is updated based on the
most recent value and avoids any stale data issues.

Use Promise.all for parallel requests: Since the fetchStudentData, fetchSchoolData, and
fetchLegalguardianData functions appear to be independent and can be executed in parallel,
you can use Promise.all to fetch the data concurrently instead of sequentially. This can
significantly reduce the overall execution time. By using Promise.all for parallel requests, the
fetching of student data, school data, and legal guardian data can happen concurrently, leading
to improved performance.

Initialize state with useMemo: If the initial studentsData, schoolsData, and legalguardiansData
are static and don't change over time, you can use useMemo to initialize them once instead of
having them as state variables. This prevents unnecessary re-initialization and re-rendering. By
initializing the data as memoized values, they will only be computed once and won't trigger
re-computation or re-rendering when other state or prop changes occur.

These optimizations should help to minimize unnecessary re-renders and improve the overall
performance of the code.


==================================CODE=============================
import React, { useState, useMemo } from 'react';
import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData, fetchSchoolData, fetchLegalguardianData } from '../utils';
const StudentsDataComponent = () => {
const [studentIds, setStudentIds] = useState([]);
const studentsData = useMemo(() => [], []);
const schoolsData = useMemo(() => [], []);
const legalguardiansData = useMemo(() => [], []);
const onStudentsPick = async (selectedStudentIds) => {
const fetchStudentPromises = selectedStudentIds.map(fetchStudentData);
const newStudentsData = await Promise.all(fetchStudentPromises);
const fetchSchoolPromises = newStudentsData
.flatMap(studentData => studentData.map(student => fetchSchoolData(student.schoolId)));
const newSchoolsData = await Promise.all(fetchSchoolPromises);
const fetchLegalguardianPromises = newStudentsData
.flatMap(studentData => studentData.map(student =>
fetchLegalguardianData(student.legalguardianId)));
const newLegalguardiansData = await Promise.all(fetchLegalguardianPromises);
setStudentsData(prevStudentsData => [...prevStudentsData, ...newStudentsData]);
setSchoolsData(prevSchoolsData => [...prevSchoolsData, ...newSchoolsData]);
setLegalguardiansData(prevLegalguardiansData => [...prevLegalguardiansData,
...newLegalguardiansData]);
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

===================================CODE============================

With these optimizations, the state updates will only occur once at the end of the
onStudentsPick function, reducing unnecessary re-renders and improving performance.
