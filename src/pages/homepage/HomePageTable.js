import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Chip, Grid, LinearProgress } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import FailIcon from "@mui/icons-material/Close";
const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amountDue",
    headerName: "Amount Due",
    width: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "jobStatus",
    headerName: "Payement Status",
    align: "center",
    headerAlign: "center",
    description: "This column is not sortable.",
    sortable: false,
    width: 250,
    renderCell: (params) => {
      //const jobStatus = this.state.execution_status[params.id - 1];
      const job_statuses = ["completed", "failed", "pending"];
      const random = Math.floor(Math.random() * job_statuses.length);
      const jobStatus = job_statuses[random];
      return (
        <Grid container direction="row" justifyContent="center" spacing={2}>
          {jobStatus === "completed" ? (
            <Chip
              icon={<DoneIcon fontSize="small" style={{ color: "#388e3c" }} />}
              variant="outlined"
              size="small"
              style={{ borderColor: "#388e3c", color: "#388e3c" }}
              label="Success"
            />
          ) : jobStatus === "failed" ? (
            <Chip
              icon={<FailIcon fontSize="small" style={{ color: "#d32f2f" }} />}
              variant="outlined"
              size="small"
              style={{
                borderColor: "#d32f2f",
                color: "#d32f2f",
                paddingLeft: "5px",
              }}
              label="Failed"
            />
          ) : (
            <Chip
              icon={
                <Box sx={{ width: "20%", padding: 0 }}>
                  <LinearProgress />
                </Box>
              }
              variant="outlined"
              size="small"
              style={{
                borderColor: "#0076ce",
                color: "#0076ce",
                paddingLeft: "5px",
                width: "50%",
              }}
              label="Pending"
            />
          )}
        </Grid>
      );
    },
  },
  {
    field: "paymentReason",
    headerName: "Payment Reason",
    width: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amountPaid",
    headerName: "Paid Till",
    type: "number",
    headerAlign: "center",
    align: "center",
    width: 150,
  },
  //   {
  //     field: "storeName",
  //     headerName: "Store Name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: false,
  //     headerAlign: "center",
  //     align: "center",
  //     width: 200,
  //     // valueGetter: (params) =>
  //     //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  //   },

  {
    field: "actions",
    headerName: "Actions",
    headerAlign: "center",
    align: "center",
    description: "This column is not sortable.",
    sortable: false,
    width: 280,
    renderCell: (params) => {
      //   const validation_details = this.state.validation_details[params.id - 1];

      //   const onClick = (e) => {
      //     //const currentRow = params.row;
      //     return alert(
      //       JSON.stringify(JSON.parse(validation_details), null, 2)
      //       //JSON.stringify(JSON.parse(currentRow), null, 2)
      //     );
      //     //console.log(params);
      //   };

      return (
        <Grid container direction="row" justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              // onClick={onClick}
            >
              Info
            </Button>
          </Grid>
        </Grid>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    vendorName: "Vendor X",
    amountDue: 1500,
    amountPaid: 800,
    paymentReason: "Supplies",
    payerName: "Your Company",
  },
  {
    id: 2,
    vendorName: "Vendor Y",
    amountDue: 800,
    amountPaid: 400,
    paymentReason: "Services",
    payerName: "Your Company",
  },
  {
    id: 3,
    vendorName: "Vendor Z",
    amountDue: 2500,
    amountPaid: 1200,
    paymentReason: "Equipment",
    payerName: "Your Company",
  },
  {
    id: 4,
    vendorName: "Vendor A",
    amountDue: 1200,
    amountPaid: 700,
    paymentReason: "Consulting",
    payerName: "Your Company",
  },
  {
    id: 5,
    vendorName: "Vendor B",
    amountDue: 1000,
    amountPaid: 600,
    paymentReason: "Materials",
    payerName: "Your Company",
  },
  {
    id: 6,
    vendorName: "Vendor C",
    amountDue: 1800,
    amountPaid: 1500,
    paymentReason: "Maintenance",
    payerName: "Your Company",
  },
  {
    id: 7,
    vendorName: "Vendor D",
    amountDue: 3000,
    amountPaid: 2000,
    paymentReason: "Software",
    payerName: "Your Company",
  },
  {
    id: 8,
    vendorName: "Vendor E",
    amountDue: 900,
    amountPaid: 500,
    paymentReason: "Advertising",
    payerName: "Your Company",
  },
  {
    id: 9,
    vendorName: "Vendor F",
    amountDue: 2000,
    amountPaid: 1000,
    paymentReason: "Construction",
    payerName: "Your Company",
  },
  {
    id: 10,
    vendorName: "Vendor G",
    amountDue: 1300,
    amountPaid: 800,
    paymentReason: "Logistics",
    payerName: "Your Company",
  },
];

export default function HomePageTable() {
  return (
    <div style={{ width: "100%", borderColor: "primary" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight={true}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableSelectionOnClick
      />
    </div>
  );
}
