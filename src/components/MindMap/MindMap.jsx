import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import HistoryIcon from "@mui/icons-material/History";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PaginationItem from "@mui/material/PaginationItem";
import makeStyles from "@mui/styles/makeStyles";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { Avatar, Chip, Menu, Stack, Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2/dist/sweetalert2";
import { useMediaQuery, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useOrgContext } from "context/OrgContext";
import { useApiCall } from "components/common/appHooks.js";
import { usePlanContext } from "context/PlanContext";
import InboxIcon from "@mui/icons-material/Inbox";
import {
	PLANS_LIMIT_REACHED,
	PLAN_UNLIMITED,
} from "components/common/constants";
import { useUserContext } from "context/UserContext";
import { DialogLoader, SmallLoader } from "components/common/NewLoader";
import { fromUnixTime } from "date-fns";
import ReadMoreLess from "components/common/ReadMoreLess";
import mindMapData from "staticData/mindmap.json";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Org } from "components/Navbar/NavBar";
import { useResponsiveContext } from "context/ResponsiveContext";
const VectorData = lazy(() => import("./VectorData"));
const CustomNoRowsOverlay = lazy(
	() => import("components/common/CustomNoRowsOverlay")
);
const GroundTruthDialog = lazy(() => import("./GroundTruth/GroundTruthDialog"));
const BucketsDialog = lazy(() => import("./Buckets/BucketsDialog"));
const ViewTrainingStatusDialog = lazy(
	() => import("./ViewTrainingStatusDialog")
);
const AddDataDialog = lazy(() => import("./AddDataDialog"));
const EditDataDialog = lazy(() => import("./EditDataDialog"));

const useStyles = makeStyles((theme) => ({
	table: {
		maxWidth: 1600,
		// "& .MuiTableCell-root": {
		// 	padding: "14px",
		// },
		"& thead th": {
			position: "sticky",
			top: 0,
			color: "var(--white)",
			backgroundColor: "var(--primary)",
			fontWeight: "bold",
		},
		"& tbody tr:nth-child(even)": {
			backgroundColor: " #2872FA14",
			color: "var(--color5)",
		},
	},
	loading: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100px",
	},
	titleContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		margin: "16px auto",
		maxWidth: 1200,
	},
	pagination: {
		margin: "10px auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	tableRow: {
		whiteSpace: "break-spaces",
	},
	action_box: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexWrap: "wrap",
		gap: "0.5rem",
		marginBottom: "2.5rem",
		marginTop: "1rem",
	},
	search_container: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
		backgroundColor: "white",
		borderTopLeftRadius: "32px",
		borderTopRightRadius: "32px",
		padding: "1rem 0",
	},
}));

const MindMap = ({ toggleNav }) => {
	const { Post, Get } = useApiCall();
	const { isMobile } = useResponsiveContext();
	const classes = useStyles();
	const {
		user: { is_god },
	} = useUserContext();
	const { org } = useOrgContext();
	const { plan } = usePlanContext();
	const theme = useTheme();
	const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const [data, setData] = useState([]);

	const [openGroundTruthDialog, setOpenGroundTruthDialog] = useState(false);
	const [openBucketsDialog, setOpenBucketsDialog] = useState(false);

	const location = useLocation();
	const { search } = location;
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const page = Number(query.get("page")) || 1;
	const sortBy = Number(query.get("sort_by")) || undefined;
	const order = Number(query.get("order")) || undefined;

	const [count, setCount] = useState(0);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [hasSearched, setHasSearched] = useState(false);
	const [anchorElOrg, setAnchorElOrg] = React.useState(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset: resetForm,
	} = useForm({
		defaultValues: {
			q: "",
			numResults: 3,
		},
	});

	// Edit Dialog
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState(null);

	// Add Dialog
	const [openAddDialog, setOpenAddDialog] = useState(false);
	// Tasks
	const [openTasksDialog, setOpenTasksDialog] = useState(false);
	const fetchData = async ({ per_page = 10 } = {}) => {
		try {
			setLoading(true);
			// const response = await Get(1, "view_vectors", {
			// 	page,
			// 	per_page,
			// 	sortBy: sortBy || undefined,
			// 	order: order || undefined,
			// });
			setData(mindMapData[page].data.data);
			setTotal(mindMapData[page].data.total);
			setCount(mindMapData[page].data.last_page);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
		}
	};

	async function clearResults() {
		setHasSearched(false);
		resetForm(undefined, { keepDefaultValues: true });
		fetchData();
	}

	async function handleOpenGroundTruthDialog() {
		setOpenGroundTruthDialog(true);
	}
	async function handleOpenBucketsDialog() {
		setOpenBucketsDialog(true);
	}
	const handleOpenOrgMenu = (event) => {
		setAnchorElOrg(event.currentTarget);
	};
	const handleCloseOrgMenu = () => {
		setAnchorElOrg(null);
	};
	async function searchVectors({ q, numResults }) {
		try {
			setLoading(true);
			const response = await Post(1, "search_vectors", {
				q,
				num_results: numResults,
			});
			setData(response.data.data);
			setHasSearched(true);
			setCount(1);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}

	// TODO: disabled from backend
	// const handleSort = useCallback((column) => {
	// 	setData([]);
	// 	const searchParams = new URLSearchParams(search);
	// 	switch (searchParams.get("order")) {
	// 		case "desc":
	// 			searchParams.set("order", "asc");
	// 			break;
	// 		case "asc":
	// 			searchParams.delete("order");
	// 			break;
	// 		default:
	// 			searchParams.set("order", "desc");
	// 			break;
	// 	}
	// 	searchParams.set("page", 1);
	// 	searchParams.set("sort_by", column);
	// 	history.push({ search: searchParams.toString() });
	// }, []);

	const columns = useMemo(
		() => [
			{
				field: "data",
				headerName: "Title",
				align: "left",
				headerAlign: "left",
				flex: 1,
				filterable: false,
				renderCell: (params) => (
					<Box sx={{ py: 2, px: 1 }}>
						<ReadMoreLess height={50}>
							{params.row.metadata.text}
							{params.row.metadata.read_more_link ? (
								<>
									{" "}
									<a
										style={{ textDecoration: "underline" }}
										target="_blank"
										href={params.row.metadata.read_more_link}
										rel="noreferrer"
									>
										{params.row.metadata?.read_more_label || "Read More"}
									</a>
								</>
							) : (
								""
							)}
						</ReadMoreLess>
					</Box>
				),
			},
			{
				field: "source",
				headerName: "Source",
				align: "center",
				headerAlign: "center",
				filterable: false,
				renderCell: (params) => {
					try {
						new URL(params.row.metadata.source_url);
						return (
							<Typography
								variant="subtitle2"
								component="a"
								href={params.row.metadata.source_url}
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: "underline" }}
							>
								Open Link
							</Typography>
						);
					} catch (error) {
						return <Typography variant="subtitle2">--</Typography>;
					}
				},
			},
			...(hasSearched
				? [
						{
							field: "score",
							headerName: "Score",
							align: "center",
							headerAlign: "center",
							filterable: true,
							renderCell: (params) => (
								<Typography variant="subtitle2">{params.row.score}</Typography>
							),
						},
					]
				: []),
			{
				field: "type",
				headerName: "Type",
				align: "center",
				headerAlign: "center",
				filterable: true,
				renderCell: (params) => (
					// TODO: Add color for diffrent types
					<Chip
						label={params.row.metadata.source_type}
						variant="outlined"
						color="primary"
						size="small"
					/>
				),
			},
			{
				field: "created_at",
				headerName: "Created At",
				align: "center",
				headerAlign: "center",
				filterable: true,
				renderCell: (params) => (
					<Typography variant="subtitle2">
						{fromUnixTime(
							params.row?.metadata?.created_at
						).toLocaleDateString()}
					</Typography>
				),
			},
			// {
			// 	id: "read_more_link",
			// 	label: "Link",
			// },
			// {
			// 	id: "updated_at",
			// 	label: "Updated At",
			// },
			// { id: "read_more_link", label: "Link" },
			// { id: "updated_at", label: "Updated At" }
			{
				field: "actions",
				headerName: "Actions",
				align: "center",
				headerAlign: "center",
				filterable: false,
				renderCell: (params) => (
					<>
						<IconButton
							color="primary"
							onClick={() => handleOpenEditDialog(params.row)}
						>
							<EditIcon />
						</IconButton>
						<IconButton
							color="secondary"
							onClick={() => handleDelete(params.row.vector_id)}
						>
							<DeleteIcon />
						</IconButton>
					</>
				),
			},
		],
		[hasSearched]
	);

	const handleOpenEditDialog = async (data) => {
		setEditData(data);
		// setEditDescription(description);
		setOpenEditDialog(true);
	};

	const handleCloseEditDialog = async () => {
		setOpenEditDialog(false);
		setEditData(null);
	};
	async function handleDelete(id) {
		try {
			const result = await Swal.fire({
				title: "Confirmation",
				text: "Are you sure you want to delete this data?",
				icon: "warning",
				showCancelButton: true,
			});

			if (result.isConfirmed) {
				// Call your delete API endpoint with the necessary parameters
				await Post(1, "delete_vector", { vector_id: id });

				// Update the originally mapped data
				setData((prevData) => prevData.filter((item) => item.vector_id !== id));

				toast.success("Data has been deleted");
			}
		} catch (error) {
			console.error("Error deleting data:", error);
			toast.error("Failed to delete data.");
		}
	}

	const handleOpenAddDialog = async () => {
		if (plan.training !== PLAN_UNLIMITED && total >= plan.training && !is_god) {
			return toast.info(PLANS_LIMIT_REACHED);
		}
		setOpenAddDialog(true);
	};
	const handleOpenTasksDialog = async () => {
		setOpenTasksDialog(true);
	};

	useEffect(() => {
		setData([]);
		// setCount(0);
		fetchData();
		// return addBeyondChat();
	}, [org.host_url, page, order, sortBy]);
	const getRowId = (row) => row.vector_id; // Assuming vector_id is the unique identifier for each row
	const {
		orgs,
		org: { host_url },
	} = useOrgContext();
	const currOrgName = useMemo(
		() =>
			orgs.filter((org) => org?.host_url === decodeURIComponent(host_url))?.[0]
				?.name,
		[host_url, orgs]
	);
	const {
		user: { access_token, email, name },
		setUser,
	} = useUserContext();
	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "1rem",
					backgroundColor: isMobile ? "white" : "transparent",
					width: "100%",
				}}
			>
				{isMobile ? (
					<Avatar
						alt={name}
						src={`https://api.dicebear.com/5.x/micah/svg?seed=${email}`}
						sx={{ boxShadow: "0px 0px 0px 2px var(--primary)" }}
						onClick={toggleNav}
					/>
				) : (
					<img
						style={{
							marginLeft: "1rem",
							marginTop: "1rem",
						}}
						src="/Group 85.png"
						alt=""
					/>
				)}

				<Tooltip title="View Orgs">
					<Button
						variant="outlined"
						disableFocusRipple
						disableTouchRipple
						classes={{
							root: classes.orgBtn,
						}}
						sx={{
							backgroundColor: "white",
							borderRadius: "20px",
							padding: "0.8rem",
						}}
						endIcon={<KeyboardArrowDown />}
						onClick={handleOpenOrgMenu}
					>
						<Typography
							variant="h5"
							component="div"
							className={classes.orgName}
						>
							{currOrgName ?? "Select Org"}
						</Typography>
						{/* <KeyboardArrowDown
											classes={{
												root: classes.arrowDown,
											}}
										/> */}
					</Button>
				</Tooltip>
				<Menu
					sx={{ mt: "45px" }}
					id="menu-appbar"
					anchorEl={anchorElOrg}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					keepMounted
					transformOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					open={Boolean(anchorElOrg)}
					onClose={handleCloseOrgMenu}
				>
					{orgs?.length > 0 ? (
						orgs.map((org, index) => (
							<Org
								org={org}
								key={index}
								handleCloseOrgMenu={handleCloseOrgMenu}
							/>
						))
					) : (
						<p className={classes.noOrg}>
							You are not a part of any organization
						</p>
					)}
				</Menu>
			</div>
			<div className={classes.titleContainer}>
				{isMobile && (
					<img
						style={{
							marginLeft: "1rem",
							marginTop: "1rem",
						}}
						src="/Group 85.png"
						alt=""
					/>
				)}
				<Typography
					variant="h2"
					component="span"
					align="center"
					style={{
						marginTop: "1rem",
						fontSize: isMobile ? "2rem" : "3rem",
						fontFamily: "poppins",
						fontWeight: "bold",
					}}
				>
					Chatbot Mind Map
				</Typography>
				<Typography
					variant="p"
					component="span"
					align="center"
					style={{
						margin: "1rem 0",
						width: isMobile ? "90%" : "50%",
						fontSize: isMobile ? "0.8rem" : "1rem",
					}}
				>
					This is the brain and the memory of the chatbot. You can add, edit and
					analyse the source data being used to answer user queries from here
				</Typography>
				<Box className={classes.action_box}>
					<Button
						sx={{ width: isMobile ? "75%" : "auto" }}
						size="large"
						variant="contained"
						color="secondary"
						startIcon={<AddIcon />}
						onClick={handleOpenAddDialog}
					>
						<Typography
							style={{
								textTransform: "Capitalize",
								fontSize: isMobile ? "1.1rem" : "1.3rem",
							}}
							variant="h6"
							component="span"
							align="left"
						>
							Add Data
						</Typography>
					</Button>
					<Button
						sx={{ width: isMobile ? "75%" : "auto" }}
						size="large"
						variant="contained"
						color="primary"
						startIcon={<HistoryIcon />}
						onClick={handleOpenTasksDialog}
					>
						<Typography
							style={{
								textTransform: "Capitalize",
								fontSize: isMobile ? "1.1rem" : "1.3rem",
							}}
							variant="h6"
							component="span"
							align="left"
						>
							Data Training Status
						</Typography>
					</Button>
					<Button
						sx={{ width: isMobile ? "75%" : "auto" }}
						size="large"
						variant="contained"
						color="secondary"
						startIcon={<QuestionAnswerIcon />}
						onClick={handleOpenGroundTruthDialog}
					>
						<Typography
							style={{
								textTransform: "Capitalize",
								fontSize: isMobile ? "1.1rem" : "1.3rem",
							}}
							variant="h6"
							component="span"
							align="center"
						>
							Ground Truths
						</Typography>
					</Button>
					{is_god ? (
						<Button
							variant="outlined"
							startIcon={<InboxIcon />}
							onClick={handleOpenBucketsDialog}
						>
							<Typography variant="h6" component="span" align="center">
								Buckets
							</Typography>
						</Button>
					) : null}
				</Box>
			</div>
			<div style={{ padding: "0rem 2rem" }}>
				{/* f */}
				{isMobile && (
					<div>
						<hr />
						<Typography
							variant="p"
							sx={{
								padding: "0.2rem",
								backgroundColor: "#EBF1FE",
								position: "relative",
								bottom: "13px",
								left: "130px",
							}}
						>
							Data
						</Typography>
						<form
							onSubmit={handleSubmit(searchVectors)}
							className={classes.search_containerMobile}
						>
							<TextField
								label="Search"
								variant="outlined"
								error={errors?.q?.type}
								helperText={errors?.q?.message}
								sx={{
									mt: 1,
									width: "95%",
									marginLeft: "0.5rem",
									backgroundColor: "white",
									borderRadius: "5px",
								}}
								size="small"
								{...register("q", {
									required: "Required",
								})}
							/>
							<Button
								size="small"
								type="submit"
								variant="outlined"
								sx={{ position: "relative", bottom: "34px", left: "230px" }}
							>
								Search
							</Button>
						</form>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<Typography
								variant="p"
								sx={{
									fontSize: "0.8rem",
									marginTop: "1.2rem",
									fontWeight: "500",
								}}
							>
								{" "}
								Search Results
							</Typography>
							<TextField
								select
								label="Results"
								defaultValue={3}
								sx={{ m: 1, minWidth: 80 }}
								size="small"
								{...register("numResults")}
							>
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50].map((value) => (
									<MenuItem key={value} value={value}>
										{value}
									</MenuItem>
								))}
							</TextField>

							{hasSearched ? (
								<Button
									color="secondary"
									variant="outlined"
									sx={{ my: 1 }}
									onClick={clearResults}
								>
									Clear Results
								</Button>
							) : null}
						</div>
					</div>
				)}

				{/*  */}

				<Box
					sx={{
						borderRadius: "32px",
						height: "100%",
						backgroundColor: "white",
					}}
				>
					{isSmScreen ? (
						loading ? (
							<SmallLoader />
						) : (
							<Suspense fallback={<SmallLoader />}>
								<Box sx={{ backgroundColor: "#EBF1FE" }}>
									{data.map((item) => (
										<VectorData
											key={item.vector_id}
											data={item}
											handleOpenEditDialog={handleOpenEditDialog}
											handleDelete={handleDelete}
										/>
									))}
								</Box>
							</Suspense>
						)
					) : (
						<Box
							sx={{
								width: "100%",
								minWidth: "960px",
							}}
						>
							<form
								onSubmit={handleSubmit(searchVectors)}
								className={classes.search_container}
							>
								<div>
									<Typography
										variant="h4"
										sx={{
											marginLeft: "3rem",
											marginTop: "1rem",
											fontWeight: "600",
											fontSize: "2.1rem",
										}}
									>
										Data
									</Typography>
								</div>
								<div>
									<TextField
										label="Search"
										variant="outlined"
										error={errors?.q?.type}
										helperText={errors?.q?.message}
										sx={{
											mt: 1,
											width: "30rem",
											overflow: "auto",
										}}
										size="small"
										{...register("q", {
											required: "Required",
										})}
									/>
									<Button
										size="large"
										type="submit"
										variant="outlined"
										sx={{ ml: 1, mt: 1 }}
									>
										Search
									</Button>
								</div>
								<div>
									<TextField
										select
										label="Results"
										defaultValue={3}
										sx={{ m: 1, minWidth: 120 }}
										size="small"
										{...register("numResults")}
									>
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50].map((value) => (
											<MenuItem key={value} value={value}>
												{value}
											</MenuItem>
										))}
									</TextField>

									{hasSearched ? (
										<Button
											color="secondary"
											variant="outlined"
											sx={{ my: 1 }}
											onClick={clearResults}
										>
											Clear Results
										</Button>
									) : null}
								</div>
							</form>
							<DataGrid
								sx={{
									"& .MuiDataGrid-cell": {
										borderRight: "1px solid rgba(224, 224, 224, 1)",
									},
									"& .MuiDataGrid-cell:last-child": {
										borderRight: "none",
									},
									".MuiDataGrid-columnHeadersInner": {
										color: "black",
										fontSize: "1.1rem",
									},
									".MuiDataGrid-columnHeaderTitleContainer": {
										paddingLeft: "0.5rem",
									},
									color: "black",
								}}
								rows={data}
								columns={columns}
								loading={loading}
								autoHeight
								getRowId={getRowId}
								slots={{
									noRowsOverlay: CustomNoRowsOverlay,
								}}
								slotProps={{
									noRowsOverlay: {
										title:
											"Looks like you have not added any data, click on the Add Data Button above",
									},
									loadingOverlay: {
										title: "Loading...",
									},
								}}
								disableSelectionOnClick
								disableRowSelectionOnClick
								hideFooter
								getRowHeight={() => "auto"}
							/>
						</Box>
					)}
				</Box>
				<Stack spacing={2} alignItems="center" my={1}>
					<Pagination
						page={page}
						count={count}
						sx={{ m: "10px auto" }}
						color="primary"
						renderItem={(item) => {
							const searchParams = new URLSearchParams(location.search);
							searchParams.set("page", item.page);
							return (
								<PaginationItem
									component={Link}
									to={`${location.pathname}?${searchParams.toString()}`}
									{...item}
								/>
							);
						}}
					/>
				</Stack>
			</div>
			<Suspense fallback={<></>}>
				<AddDataDialog {...{ openAddDialog, setData, setOpenAddDialog }} />
			</Suspense>
			<Suspense fallback={<></>}>
				<ViewTrainingStatusDialog
					{...{ openTasksDialog, setOpenTasksDialog }}
				/>
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openEditDialog && editData ? (
					<EditDataDialog
						{...{
							editData,
							setData,
							openEditDialog,
							setOpenEditDialog,
							handleCloseEditDialog,
						}}
					/>
				) : null}
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openGroundTruthDialog ? (
					<GroundTruthDialog
						{...{
							openGroundTruthDialog,
							setOpenGroundTruthDialog,
						}}
					/>
				) : null}
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openBucketsDialog ? (
					<BucketsDialog
						{...{
							openBucketsDialog,
							setOpenBucketsDialog,
						}}
					/>
				) : null}
			</Suspense>
		</>
	);
};

export default withErrorBoundary(MindMap, "MindMap");
