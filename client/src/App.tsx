import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

import useProductStore from "./store/productStore";
import Input from "./components/Input";
import Grid from "@mui/material/Unstable_Grid2";
import Sphere from "./components/Sphere";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { LineChart } from "@mui/x-charts/LineChart";

const App = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const { products, product, productsCount, getData, getOneProduct } =
    useProductStore((state) => ({
      products: state.products,
      product: state.product,
      productsCount: state.count,
      getData: state.getData,
      getOneProduct: state.getOneProduct,
    }));

  const fetchData = async (searchQuery: string) => {
    setLoading(true);
    setTimer(0);
    const startTime = Date.now();
    await getData(searchQuery);
    setLoading(false);
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;
    setTimer(elapsedTime);
  };

  useEffect(() => {
    let intervalId: number | undefined;

    if (isLoading) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading, getData]);

  const handleSearch = (searchQuery: string) => {
    fetchData(searchQuery);
  };

  const handleRowClick = async (rowData: any) => {
    setSelectedRow(rowData.row.link);
    setLoadingProduct(true);
    await getOneProduct(rowData.row.link);
    setLoadingProduct(false);
  };

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Image"
          onError={(e) => {
            e.currentTarget.src = "/public/no-image.jpg";
            e.currentTarget.alt = "No Image";
          }}
          style={{ height: "128px", width: " 128px", objectFit: "cover" }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Название",
      width: 200,
      editable: false,
    },
    {
      field: "price",
      headerName: "Цена",
      width: 150,
      editable: false,
    },
    {
      field: "link",
      headerName: "Ссылка",
      width: 150,
      editable: false,
      renderCell: (params) => <a href={params.value}>Перейти</a>,
    },
  ];

  return (
    <div className="wrapper">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          width: "100%",
        }}>
        <Sphere />
        <Stack
          mt={40}
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Input placeholder="Поиск" onSearch={handleSearch} />
            <Box
              py={1}
              px={2}
              border={1}
              borderRadius={2}
              borderColor={"#535bf2"}>
              <Typography textAlign={"center"} variant="h6">
                {timer.toFixed(2)} сек
              </Typography>
            </Box>
            <Box
              py={1}
              px={2}
              border={1}
              borderRadius={2}
              borderColor={"#535bf2"}>
              <Typography textAlign={"center"} variant="h6">
                {productsCount}
              </Typography>
            </Box>
          </Stack>
          {isLoading ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <CircularProgress
                sx={{ marginTop: 16, color: "#747bff" }}
                color="inherit"
              />
            </Box>
          ) : (
            products && (
              <Grid container spacing={2}>
                <Grid xs sx={{ width: "33%" }}>
                  <DataGrid
                    className="scroll"
                    rows={products.lamoda}
                    columns={columns}
                    rowHeight={128}
                    onRowClick={handleRowClick}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid xs sx={{ width: "33%" }}>
                  <DataGrid
                    className="scroll"
                    rows={products.brandshop}
                    columns={columns}
                    rowHeight={128}
                    onRowClick={handleRowClick}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid xs sx={{ width: "33%" }}>
                  <DataGrid
                    className="scroll"
                    rows={products.sneakerhead}
                    columns={columns}
                    rowHeight={128}
                    onRowClick={handleRowClick}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            )
          )}
        </Stack>
      </Box>

      {selectedRow && (
        <Box
          className="sidebar"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999,
            height: "100vh",
            width: "400px",
            backgroundColor: "#1f1f1f",
            boxShadow: "4px 16px 16px #000000",
            transition: "transform 0.3s ease-in-out",
            transform: "translateX(0)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
          }}>
          {isLoadingProduct ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <CircularProgress
                sx={{ marginTop: 16, color: "#747bff" }}
                color="inherit"
              />
            </Box>
          ) : (
            product &&
            product.images && (
              <div className="sidebar-inner scroll">
                <Box sx={{ width: 360 }}>
                  <ImageList variant="masonry" cols={3} gap={8}>
                    {product.images.map((item) => (
                      <ImageListItem key={item}>
                        <img
                          srcSet={`${item}`}
                          src={`${item}`}
                          alt={item}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
                <Divider />
                <Button
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}>
                  <a href={selectedRow}>ИСТОЧНИК</a>
                </Button>
                <Divider />

                <Stack direction="column" gap={2}>
                  <Typography variant="h4">{product.brand}</Typography>
                  <Divider />
                  <Typography variant="h5">{product.name}</Typography>
                  <Divider />
                  <Typography variant="h5">{product.price} ₽</Typography>
                  <Divider />
                  <Typography variant="h5">Размеры:</Typography>
                  {product.sizes &&
                    product.sizes.map((size, index) => (
                      <Chip key={index} variant="outlined" label={size} />
                    ))}
                  <LineChart
                    xAxis={[
                      {
                        scaleType: "time",
                        data: product.prices?.map((i) => new Date(i.date)),
                        valueFormatter: (value) => value.toLocaleDateString(),
                      },
                    ]}
                    series={[
                      {
                        data: product.prices?.map((i) => i.price),
                        area: true,
                      },
                    ]}
                    height={320}
                  />
                </Stack>
              </div>
            )
          )}
          <Button
            onClick={() => setSelectedRow(null)}
            style={{
              backgroundColor: "#535bf2",
              color: "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              width: "100%",
            }}>
            Закрыть
          </Button>
        </Box>
      )}
    </div>
  );
};

export default App;
