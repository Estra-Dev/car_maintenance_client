"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface MaintenanceTask {
  _id: string;
  vehiclePlateNo: string;
  serviceType: string;
  scheduledDate: string;
  nextServiceDate: string;
  estimatedCost: number;
  priority: string;
  note: string;
}
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

const Alerts = () => {

  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([]);
  const [documents, setDocuments] = useState<DocumentTask[]>([]);
  const [almosDueMaintenance, setAlmosDueMaintenance] = useState<MaintenanceTask[]>([]);


  const allMaintenance = async () => {
      try {
        const res = await fetch("/api/maintenance/allMaintenance");
        const data = await res.json();
        setMaintenance(data.maintenances);

        const today = new Date();
        const upcomingMaintenance = data.maintenances.filter(
          (task: MaintenanceTask) => {
            const serviceDate = new Date(task.nextServiceDate);
            const timeDiff = serviceDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return daysDiff > 0 && daysDiff <= 30; // Maintenance tasks due in the next 30 days
          }
        );

        setAlmosDueMaintenance(upcomingMaintenance);
      } catch (error) {
        console.log("error fetching maintenance data", error);
      }
  };

  const allDocuments = async () => {
    try {
      const response = await axios.get("/api/documents/allDocuments");
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const getMaintenanceAlerts = () => {
    const currentDate = new Date();
    let due = 0
    let dueSoon = 0
    maintenance.forEach((task) => {
      const taskDate = new Date(task.scheduledDate)
      const nextTaskDate = new Date(task.nextServiceDate)
      const dayUntilTask = Math.ceil((taskDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      const dayUntilNextTask = Math.ceil((nextTaskDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      // console.log("dayUntilTask", dayUntilTask);
      if (dayUntilTask < 0) {
        due ++;
      } 
      if (dayUntilNextTask <= 30) {
        dueSoon ++;
      }
    })

    return {due, dueSoon}; 
  }

  const getDocumentAlerts = () => {
    const currentDate = new Date();
    let expired = 0
    let expiringSoon = 0
    documents.forEach((doc) => {
      const docDate = new Date(doc.expiryDate)
      const dayUntilDocExpiry = Math.ceil((docDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      if (dayUntilDocExpiry < 0) {
        expired ++;
      } else if (dayUntilDocExpiry <= 30) {
        expiringSoon += 1;
      }
    })

    return {expired, expiringSoon}; 
  }

  const documentAlerts = getDocumentAlerts();
  const maintenanceAlerts = getMaintenanceAlerts();

  

  // console.log("documents", documents);
  
  console.log("All maintenance", maintenance);
  useEffect(() => {
    allMaintenance();
    allDocuments();
  }, []);

  return (
    <>
      {(maintenanceAlerts.due > 0 ||
        maintenanceAlerts.dueSoon > 0 ||
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
                    {maintenanceAlerts.due <= 1 ? (
                      <span>
                        {maintenanceAlerts.due > 0 ? (
                          <span>
                            {maintenanceAlerts.due} Vehicle is Due For Service
                          </span>
                        ) : (
                          <span></span>
                        )}
                      </span>
                    ) : (
                      <span>
                        {maintenanceAlerts.due} Vehicles are Due For Service
                      </span>
                    )}
                    {maintenanceAlerts.due > 0 &&
                    maintenanceAlerts.dueSoon > 0 ? (
                      <span> and </span>
                    ) : (
                      <span></span>
                    )}
                    {maintenanceAlerts.dueSoon <= 1 ? (
                      <span>
                        {maintenanceAlerts.dueSoon > 0 ? (
                          <span>
                            {almosDueMaintenance.length.toString()} Vehicle is
                            almost due for Service
                          </span>
                        ) : (
                          <span></span>
                        )}
                      </span>
                    ) : (
                      <span>
                        {almosDueMaintenance.length.toString()} Vehicles are
                        almost due For Service
                      </span>
                    )}
                  </p>
                  
                  <p className=" text-sm text-muted-foreground font-medium">
                    {documentAlerts.expired <= 1 ? (
                      <span>
                        {documentAlerts.expired > 0 ? (
                          <span>{documentAlerts.expired} Document has Expired</span>
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
                    {documentAlerts.expiringSoon <= 1 ? (
                      <span>
                        {
                          documentAlerts.expiringSoon > 0 ? (
                            <span>{documentAlerts.expiringSoon} Document is expiring soon</span>
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

export default Alerts
