import React from "react";
import ReadMoreLess from "components/common/ReadMoreLess";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete, Edit } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		padding: "0.86rem",
		borderRadius: "20px",
		boxShadow: "0 0 0.15rem 0 rgba(224, 224, 224, 0.5)",
		outline: "0.1rem solid rgba(224, 224, 224, 0.5)",
		backgroundColor: "#fff",
		marginBottom: "1rem",
	},

	source_type_container: {
		display: "flex",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "1rem",
	},
	source_type: {
		fontSize: "0.6rem",
		color: "var(--color5)",
		fontWeight: "bold",
		textTransform: "uppercase",
	},
	footer_container: {
		display: "flex",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "0.7rem",
	},
	details_container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		gap: "0.25rem",
	},
	source_link: {
		color: "var(--color5)",
		textDecoration: "underline",
	},
	actions_container: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		// gap: "0.5rem",
		marginTop: "1rem",
	},
}));

const VectorData = ({ data, handleOpenEditDialog, handleDelete }) => {
	const classes = useStyles();
	return (
		<Box className={classes.root}>
			<Typography
				sx={{ fontWeight: "500", marginBottom: "0.5rem" }}
				variant="p"
				align="left"
			>
				Title
			</Typography>
			<ReadMoreLess height={50}>{data?.metadata?.text}</ReadMoreLess>
			<Box className={classes.source_type_container}>
				<div>
					<Typography
						sx={{ fontWeight: "500", marginBottom: "0.9rem" }}
						variant="p"
						align="left"
					>
						Type
					</Typography>
					<Typography
						variant="subtitle1"
						color="textPrimary"
						className={classes.source_type}
					>
						{data?.metadata?.source_type ?? "Unknown Source"}
					</Typography>
				</div>
				<div>
					<Typography
						sx={{ fontWeight: "500", marginBottom: "0.9rem" }}
						variant="p"
						align="left"
					>
						Source
					</Typography>
					<Typography variant="subtitle1" color="textPrimary">
						<a
							href={data?.metadata?.source_url ?? "#"}
							target="_blank"
							rel="noreferrer"
							className={classes.source_link}
						>
							View Source
						</a>
					</Typography>
				</div>
				<div>
					<Typography
						sx={{ fontWeight: "500", marginBottom: "0.9rem" }}
						variant="p"
						align="left"
					>
						Created At
					</Typography>
					<Typography variant="subtitle1" color="textSecondary">
						{new Intl.RelativeTimeFormat("en", {
							numeric: "auto",
						}).format(-new Date(data?.metadata?.created_at), "days")}
					</Typography>
				</div>
			</Box>

			<Box className={classes.actions_container}>
				<Button
					sx={{
						borderRadius: "10px",
						padding: "0.4rem 3rem",
					}}
					variant="outlined"
					size="large"
					color="primary"
					onClick={() => handleOpenEditDialog(data)}
				>
					Edit
				</Button>
				<Button
					sx={{
						borderRadius: "10px",
						padding: "0.4rem 3rem",
					}}
					variant="outlined"
					color="error"
					size="large"
					onClick={() => handleDelete(data?.vector_id)}
				>
					Delete
				</Button>
			</Box>
		</Box>
	);
};

export default VectorData;
