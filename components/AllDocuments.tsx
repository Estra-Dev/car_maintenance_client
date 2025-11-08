"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle,  Edit,  File, Trash2,  } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import axios from 'axios';
import { Button } from './ui/button';
import DocAlert from './DocAlert';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "./ui/dialog";
import AddDocument from './AddDocument';

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

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  assignedTo: string;
  department: string;
  status: string;
  nextService: string;
}

const AllDocuments = () => {
  
  const [documents, setDocuments] = useState<DocumentTask[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [edit, setEdit] = useState(false)
  const [editId, setEditId] = useState("")
  const [formData, setFormData] = useState({
    vehicle: "",
    documentType: "",
    issueDate: "",
    expiryDate: "",
    documentNumber: "",
    issuingAuth: "",
    reminderDayBeforeExpiry: "",
  });

  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [vehicleSearch, setVehicleSearch] = useState("")
  const [status, setStatus] = useState("")

  const validDocuments = documents.filter(
    (d) => d.status === "active"
  ).length;
  const expiringDocuments = documents.filter(
    (d) => d.status === "expiring"
  ).length;
  const expiredDocuments = documents.filter(
    (d) => d.status === "expired"
  ).length;

  const documentStats = [
    {
      title: "Total Documents",
      value: documents.length.toString(),
      description: "Across all Vehicle.",
      icon: <File className=" h-4 w-4 text-muted-foreground" />,
      color: "text-bg-gray-500",
    },
    {
      title: "Active Documents",
      value: validDocuments.toString(),
      description: "Valid Documents",
      icon: <File className=" h-4 w-4 text-muted-foreground" />,
      color: "text-lime-600",
    },
    {
      title: "Expiring Soon",
      value: expiringDocuments.toString(),
      description: "Within 30 Days",
      icon: <AlertTriangle className=" h-4 w-4 text-muted-foreground" />,
      color: "text-destructive",
    },
    {
      title: "Expired Documents",
      value: expiredDocuments.toString(),
      description: "Overall Fleet Status",
      icon: <AlertTriangle className=" h-4 w-4 text-muted-foreground" />,
      color: "text-destructive",
    },
  ];

  const allDocuments = async () => {
    try {
      const response = await axios.get("/api/documents/allDocuments");
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchDoc = async () => {
    try {
      const res = await axios.get("/api/documents/allDocuments", {
        params: {vehicleSearch, status}
      })
      setDocuments(res.data.documents)
    } catch (error) {
      console.log("Error fetching Documents", error)
    }
  }

  const allVehicles = async () => {
    try {
      const response = await axios.get("/api/vehicles/vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // console.log("documents", documents);
  useEffect(() => {
    allDocuments();
    allVehicles();
  }, []);

  useEffect(() => {
    fetchDoc()
  }, [vehicleSearch, status])

  const handleDelete = async (id: string) => {
  
    if (!confirm("Are you sure you want to delete this Document?")) {
      return;
    }

    try {
      const res = await axios.delete(`/api/documents/${id}`, {
        headers: {
          "Content-Type": "Application/json",
        },
      });

      if (res.status === 200) {
        alert("Deleted Successfully")
        allDocuments()
      }else{
        alert("Something went wrong")
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = ev.target
    setFormData({...formData, [name]: value})
    
  }
  console.log("formData", formData)


  const handleEdit = async (ev: React.FormEvent<HTMLFormElement>) => {
    console.log("Edit", editId);
    ev.preventDefault()

    const res = await axios.patch(`/api/documents/${editId}`, formData);

    if (res.status === 200) {
      console.log("Done");
      alert("Documented Updated");
      setEdit(false);
    } else {
      alert("Error Updating Document");
    }
  };


  return (
    <div>
      <AddDocument onDocumentAdded={allDocuments} />
      {/* Banner Alert */}
      <DocAlert />

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
        {documentStats.map((stat, index) => (
          <Card className=" p-4 rounded-md border bg-lime-500/20" key={index}>
            <CardHeader className=" flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className=" text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <h3 className={`${stat.color} font-bold text-2xl`}>
                {stat.value}
              </h3>
              <p className=" text-sm text-muted-foreground font-medium">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className=" mb-4">
        <CardHeader>
          <CardTitle>Filter Documents</CardTitle>
          <CardDescription>
            Filter Documents by status and vehicle
          </CardDescription>
        </CardHeader>
        <CardContent className=" flex flex-col md:justify-between md:items-center gap-4 md:flex-row">
          <div className=" flex-1 w-full ">
            <p>Filter by Vehicle</p>

            <Select value={vehicleSearch} onValueChange={setVehicleSearch}>
              <SelectTrigger className=" w-full border">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem value={vehicle.plateNumber} key={vehicle._id}>
                    {vehicle.make} {vehicle.model} ({vehicle.plateNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className=" flex-1 w-full">
            <p>Filter Status</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className=" w-full border">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="expiring">Expiring soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
          <CardDescription>Complete List of Vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Document Number</TableHead>
                <TableHead>Issuing Authority</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document._id}>
                  <TableCell>{document.vehicle}</TableCell>
                  <TableCell className="font-mono">
                    {document.documentType}
                  </TableCell>
                  <TableCell>{document.documentNumber}</TableCell>
                  <TableCell>{document.issuingAuth}</TableCell>
                  <TableCell>
                    {new Date(document.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(document.expiryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{document.status}</TableCell>
                  <TableCell className=" flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      size={"icon"}
                      onClick={() => {
                        setEdit(true);
                        setEditId(document._id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size={"icon"}
                      className=" text-destructive"
                      onClick={() => handleDelete(document._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {edit && (
        <Dialog open={edit} onOpenChange={() => setEdit(!edit)}>
          <DialogContent className=" mx-auto shadow-md max-w-lg md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Document with ID {editId}</DialogTitle>
            </DialogHeader>
            {documents.map(
              (doc) =>
                doc._id === editId && (
                  <div className="" key={doc._id}>
                    <form
                      className=" flex flex-col gap-4 space-y-4"
                      onSubmit={handleEdit}
                    >
                      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="">
                          <label htmlFor="vehicle">Vehicle</label>
                          <Select
                            value={formData.vehicle || doc.vehicle}
                            name="vehicle"
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                vehicle: value,
                              }))
                            }
                          >
                            <SelectTrigger className=" w-full border">
                              <SelectValue placeholder="Vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicles.map((v, i) => (
                                <SelectItem
                                  value={v.plateNumber}
                                  key={i || v._id}
                                >
                                  {v.plateNumber} - {v.model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="">
                          <label htmlFor="documentType">Document Type</label>
                          <input
                            className=" w-full border border-gray-300 p-2"
                            type="text"
                            id="documentType"
                            name="documentType"
                            value={formData.documentType || doc.documentType}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="">
                          <label htmlFor="scheduledDate">Issued Date</label>
                          <input
                            className="border w-full border-gray-300 p-2"
                            type="date"
                            id="issueDate"
                            name="issueDate"
                            value={
                              formData.issueDate ||
                              (doc.issueDate
                                ? new Date(doc.issueDate)
                                    .toISOString()
                                    .split("T")[0]
                                : "")
                            }
                            onChange={handleChange}
                          />
                        </div>
                        <div className="">
                          <label htmlFor="nextServiceDate">Expiry Date</label>
                          <input
                            className="border w-full border-gray-300 p-2"
                            type="date"
                            id="expiryDate"
                            name="expiryDate"
                            value={
                              formData.expiryDate ||
                              (doc.expiryDate
                                ? new Date(doc.expiryDate)
                                    .toISOString()
                                    .split("T")[0]
                                : "")
                            }
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="">
                          <label htmlFor="estimatedCost">Document Number</label>
                          <input
                            className="border w-full border-gray-300 p-2"
                            type="text"
                            id="documentNumber"
                            name="documentNumber"
                            value={
                              formData.documentNumber || doc.documentNumber
                            }
                            onChange={handleChange}
                          />
                        </div>
                        <div className="">
                          <label htmlFor="priority">Issuing Authority</label>
                          <input
                            className="border w-full border-gray-300 p-2"
                            type="text"
                            id="issuingAuth"
                            name="issuingAuth"
                            value={formData.issuingAuth || doc.issuingAuth}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="">
                        <label htmlFor="note">
                          Reminder before Expiry Date
                        </label>
                        <Select
                          name="reminderDayBeforeExpiry"
                          value={
                            formData.reminderDayBeforeExpiry ||
                            doc.reminderDayBeforeExpiry
                          }
                          onValueChange={(value) =>
                            setFormData((prevData) => ({
                              ...prevData,
                              reminderDayBeforeExpiry: value,
                            }))
                          }
                        >
                          <SelectTrigger className=" w-full border">
                            <SelectValue placeholder="Select Reminder" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="15">15 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="60">60 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {error && (
                        <div className=" border border-destructive bg-destructive/5 p-4 rounded-md text-center">
                          <p className="text-destructive">{error}</p>
                        </div>
                      )}
                      {success && (
                        <div className=" border border-lime-500 bg-lime-500/5 p-4 rounded-md text-center">
                          <p className="text-lime-500">{success}</p>
                        </div>
                      )}
                      <div className="">
                        <button
                          type="submit"
                          className="bg-lime-500 text-white rounded-md p-2"
                        >
                          Add Document
                        </button>
                      </div>
                    </form>
                  </div>
                )
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AllDocuments
