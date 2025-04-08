import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Chip, Grid, LinearProgress } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import FailIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "resourceName",
    headerName: "Last Used Resource",
    width: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "usageCount",
    headerName: "Times Used",
    width: 160,
    headerAlign: "center",
    align: "center",
    type: "number",
  },
  {
    field: "status",
    headerName: "Status",
    align: "center",
    headerAlign: "center",
    description: "Status of the resource",
    sortable: false,
    width: 220,
    renderCell: (params) => {
      const jobStatus = params.row.status;
      return (
        <Grid container direction="row" justifyContent="center" spacing={2}>
          {jobStatus === "available" ? (
            <Chip
              icon={<DoneIcon fontSize="small" style={{ color: "#388e3c" }} />}
              variant="outlined"
              size="small"
              style={{ borderColor: "#388e3c", color: "#388e3c" }}
              label="Available"
            />
          ) : jobStatus === "unavailable" ? (
            <Chip
              icon={<FailIcon fontSize="small" style={{ color: "#d32f2f" }} />}
              variant="outlined"
              size="small"
              style={{
                borderColor: "#d32f2f",
                color: "#d32f2f",
                paddingLeft: "5px",
              }}
              label="Unavailable"
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
              label="Reserved"
            />
          )}
        </Grid>
      );
    },
  },
  {
    field: "resourceType",
    headerName: "Resource Type",
    width: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "usageTime",
    headerName: "Time",
    type: "string",
    headerAlign: "center",
    align: "center",
    width: 150,
  },
  {
    field: "actions",
    headerName: "Actions",
    headerAlign: "center",
    align: "center",
    description: "Navigate to resource page",
    sortable: false,
    width: 280,
    renderCell: (params) => {
      return (
        <Grid container direction="row" justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="outlined"
              size="small"
              color="primary"
              component={Link}
              to={`/resources?id=${params.row.id}`}
            >
              Navigate
            </Button>
          </Grid>
        </Grid>
      );
    },
  },
];

// Updated rows to match the column headings for a resources usage table
const rows = [
  {
    id: 1,
    resourceName: "MacBook Pro",
    usageCount: 42,
    status: "available",
    resourceType: "Laptop",
    usageTime: "Yesterday, 2PM",
  },
  {
    id: 2,
    resourceName: "Snell Study Room",
    usageCount: 15,
    status: "reserved",
    resourceType: "Space",
    usageTime: "Today, 10AM",
  },
  {
    id: 3,
    resourceName: "USB-C Adapter",
    usageCount: 78,
    status: "available",
    resourceType: "Charger",
    usageTime: "3 days ago",
  },
  {
    id: 4,
    resourceName: "Sony HandyCam",
    usageCount: 23,
    status: "unavailable",
    resourceType: "Camera",
    usageTime: "Last week",
  },
  {
    id: 5,
    resourceName: "Microscope",
    usageCount: 8,
    status: "available",
    resourceType: "Accessory",
    usageTime: "2 weeks ago",
  },
  {
    id: 6,
    resourceName: "Surface Laptop",
    usageCount: 37,
    status: "reserved",
    resourceType: "Laptop",
    usageTime: "Yesterday, 4PM",
  },
  {
    id: 7,
    resourceName: "MagSafe Charger",
    usageCount: 61,
    status: "available",
    resourceType: "Charger",
    usageTime: "Today, 9AM",
  },
  {
    id: 8,
    resourceName: "Room Reserve",
    usageCount: 29,
    status: "available",
    resourceType: "Space",
    usageTime: "2 days ago",
  },
  {
    id: 9,
    resourceName: "Projector",
    usageCount: 14,
    status: "unavailable",
    resourceType: "Accessory",
    usageTime: "Last month",
  },
  {
    id: 10,
    resourceName: "Bluetooth Presenter",
    usageCount: 52,
    status: "available",
    resourceType: "Vending Accessory",
    usageTime: "Yesterday, 11AM",
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
