import { lazy, Suspense, useEffect, useState } from "react";
import { PeopleDirectory } from "./components/people/PeopleDirectory";
import { PeoplePageHeader } from "./components/people/PeoplePageHeader";
import { UserDetailsModal } from "./components/people/UserDetailsModal";
import { WorkspaceSidebar } from "./components/people/WorkspaceSidebar";
import { useGetUsersQuery, type User } from "./usersApi";

const CreateUserWizard = lazy(() => import("./CreateUserWizard").then((module) => ({ default: module.CreateUserWizard })));

export function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { currentData, data, isLoading, isFetching, isError } = useGetUsersQuery({ pageNumber, pageSize });
  const users = currentData?.items ?? [];
  const totalPages = currentData?.totalPages ?? 0;
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardUser, setWizardUser] = useState<User>();
  const [wizardStartAtBeginning, setWizardStartAtBeginning] = useState(false);
  const [detailsUserId, setDetailsUserId] = useState<string>();

  useEffect(() => {
    const lastPage = Math.max(1, data?.totalPages ?? 0);
    if (!isFetching && data && pageNumber > lastPage) setPageNumber(lastPage);
  }, [data, isFetching, pageNumber]);

  function closeWizard() {
    setWizardOpen(false);
    setWizardUser(undefined);
    setWizardStartAtBeginning(false);
  }

  return (
    <div className="app-shell">
      <WorkspaceSidebar peopleCount={data?.totalCount ?? 0} />
      <main className="main-content" id="people">
        <PeoplePageHeader onAddPerson={() => { setWizardUser(undefined); setWizardStartAtBeginning(false); setWizardOpen(true); }} />
        <PeopleDirectory users={users} totalCount={currentData?.totalCount ?? 0} pageNumber={pageNumber} pageSize={pageSize} totalPages={totalPages} isLoading={isLoading || (!currentData && isFetching)} isError={isError} onPageChange={setPageNumber} onPageSizeChange={(size) => { setPageSize(size); setPageNumber(1); }} onContinue={(user) => { setWizardUser(user); setWizardStartAtBeginning(false); setWizardOpen(true); }} onViewDetails={(user) => setDetailsUserId(user.id)} onEdit={(user) => { setWizardUser(user); setWizardStartAtBeginning(true); setWizardOpen(true); }} />
      </main>
      {wizardOpen && <Suspense fallback={null}><CreateUserWizard key={wizardUser?.id ?? "new"} user={wizardUser} startAtBeginning={wizardStartAtBeginning} onClose={closeWizard} /></Suspense>}
      {detailsUserId && <UserDetailsModal userId={detailsUserId} onClose={() => setDetailsUserId(undefined)} />}
    </div>
  );
}
