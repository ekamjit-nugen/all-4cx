import { DisplayError } from "@/features/ui/error/display-error";
import { RecursiveUI } from "@/features/ui/recursive-ui";
import { FindCitationByID } from "../chat-services/citation-service";

export const CitationAction = async (previousState, formData) => {
  const searchResponse = await FindCitationByID(formData.get("id"));

  if (searchResponse.status !== "OK") {
    return <DisplayError errors={searchResponse.errors} />;
  }

  if (searchResponse.status === "OK") {
    const document = searchResponse.response;

    return (
      <div className="flex flex-col gap-4 text-sm max-w-[430px]">
        <RecursiveUI documentField={document.content} />
      </div>
    );
  }

  return <div>Not found</div>;
};
