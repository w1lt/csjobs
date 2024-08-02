// Modals.js
import React from "react";
import { ModalsProvider } from "@mantine/modals";
import AuthModal from "../components/AuthModal"; // Adjust the path as needed
import accountModal from "../components/AccountModal"; // Adjust the path as needed
import ReportListingModal from "../components/ReportListingModal";
import ConfirmApplyModal from "../components/ConfirmApplyModal";
import EditListingModal from "../components/EditListingModal";
import HelpModal from "../components/HelpModal";

export const MyModalsProvider = ({ children }) => {
  return (
    <ModalsProvider
      modals={{
        auth: AuthModal,
        account: accountModal,
        reportListing: ReportListingModal,
        confirmApply: ConfirmApplyModal,
        editListing: EditListingModal,
        help: HelpModal,
      }}
    >
      {children}
    </ModalsProvider>
  );
};
