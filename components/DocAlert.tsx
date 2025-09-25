import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card';
import { AlertTriangle } from 'lucide-react';

interface DocumentTask {
  _id: string;
  vehicle: string;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  documentNumber: string;
  issuingAuth: string;
  reminderDayBeforeExpiry: string;
}

const DocAlert = () => {

  const [documents, setDocuments] = useState<DocumentTask[]>([]);

  const allDocuments = async () => {
    try {
      const response = await axios.get("/api/documents/allDocuments");
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const getDocumentAlerts = () => {
    const currentDate = new Date();
    let expired = 0;
    let expiringSoon = 0;
    documents.forEach((doc) => {
      const docDate = new Date(doc.expiryDate);
      const dayUntilDocExpiry = Math.ceil(
        (docDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
      );
      if (dayUntilDocExpiry < 0) {
        expired++;
      } else if (dayUntilDocExpiry <= 30) {
        expiringSoon += 1;
      }
    });

    return { expired, expiringSoon };
  };
  
  const documentAlerts = getDocumentAlerts();

  useEffect(() => {
      allDocuments();
    }, []);

  return (
    <>
      {(
        documentAlerts.expired ||
        documentAlerts.expiringSoon) && (
        <div className=" mb-8">
          <Card className=" bg-destructive/5 p-4 px-2 rounded-md border-destructive">
            <CardContent className=" pt-6">
              <div className=" flex gap-3 justify-start items-center">
                <AlertTriangle className=" h-10 w-10 text-destructive" />
                <div className="">
                  <p className=" text-sm text-destructive font-medium">
                    Urgent Attention Required.
                  </p>
                  <p className=" text-sm text-muted-foreground font-medium">
                    {documentAlerts.expired <= 1 ? (
                      <span>
                        {documentAlerts.expired > 0 ? (
                          <span>
                            {documentAlerts.expired} Document has Expired
                          </span>
                        ) : (
                          <span></span>
                        )}
                      </span>
                    ) : (
                      <span>
                        {documentAlerts.expired} Documents have Expired
                      </span>
                    )}
                    {documentAlerts.expired > 0 &&
                    documentAlerts.expiringSoon > 0 ? (
                      <span> and </span>
                    ) : (
                      <span></span>
                    )}
                    {documentAlerts.expiringSoon === 1 ? (
                      <span>
                        {
                          documentAlerts.expiringSoon > 0 ? (
                            <span>
                              {documentAlerts.expiringSoon} Document is expiring soon
                            </span>
                          ) : (
                            <span></span>
                          )
                        }
                      </span>
                    ) : (
                      <span>
                        {documentAlerts.expiringSoon} Documents are expiring
                        soon
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default DocAlert
