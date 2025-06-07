import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  //   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const QuaReqDialog = ({
  isOpen,
  quotationId,
  eventName,
  closeDialog,
}: {
  isOpen: boolean;
  quotationId: string;
  eventName: string;
  closeDialog: () => void;
}) => {
  return (
    <AlertDialog open={isOpen}>
      {/* <AlertDialogTrigger >Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Quotation Request Sent!</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>

          <p className="mb-2">
            Your quotation ID is{" "}
            <span className="font-bold text-gray-800">#{quotationId}</span>
          </p>
          <p className="mb-2">
            Your Event is{" "}
            <span className="font-bold text-gray-800">#{eventName}</span>
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Close</AlertDialogCancel>
          <AlertDialogAction>Call Now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuaReqDialog;
