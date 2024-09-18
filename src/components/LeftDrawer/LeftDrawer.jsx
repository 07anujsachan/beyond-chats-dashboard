import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
	Avatar,
	Button,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Tooltip,
	Typography,
	styled,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import Card from "@mui/material/Card";
import { useUserContext } from "context/UserContext";
import { useResponsiveContext } from "context/ResponsiveContext";

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const drawerWidth = 270;
const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
	[theme.breakpoints.down("sm")]: {
		width: `0px`,
	},
});
const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

const LeftDrawer = ({
	isOpened,
	toggleLeftNav,
	navOptions,
	setShowStartTutorial,
}) => {
	const {
		user: { access_token, email, name, is_god },
		setUser,
	} = useUserContext();
	const { isMobile } = useResponsiveContext();
	return (
		<Drawer
			variant="permanent"
			anchor="left"
			open={isOpened}
			onClose={toggleLeftNav}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					paddingLeft: "1rem",
				}}
			>
				<Avatar
					alt={name}
					src={`https://api.dicebear.com/5.x/micah/svg?seed=${email}`}
					sx={{ boxShadow: "0px 0px 0px 2px var(--primary)" }}
					onClick={toggleLeftNav}
				/>
				<Tooltip
					title={isOpened ? "Close Left Drawer" : "Open Left Drawer"}
					arrow
				>
					<DrawerHeader>
						<IconButton onClick={toggleLeftNav}>
							{isOpened ? <ChevronLeftIcon /> : <MenuIcon />}
						</IconButton>
					</DrawerHeader>
				</Tooltip>
			</div>
			<Divider />
			<List>
				{navOptions.map(({ title, Icon, onClick, isActive }, index) => (
					<Tooltip
						title={isOpened ? "" : title}
						arrow
						placement="right"
						key={title}
					>
						<ListItem
							disablePadding
							sx={{
								display: "block",
								borderRight: isActive ? "4px solid #2872FA" : undefined,
							}}
							className={`nav-option-${index}`}
						>
							<ListItemButton
								onClick={() => {
									toggleLeftNav(false);
									onClick();
								}}
								sx={{
									minHeight: 48,
									justifyContent: isOpened ? "initial" : "center",
									px: 2.5,
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: isOpened ? 3 : "auto",
										justifyContent: "center",
									}}
								>
									<Icon color={isActive ? "primary" : undefined} />
								</ListItemIcon>
								<ListItemText
									primary={title}
									sx={{
										color: isActive ? "#2872FA" : undefined,
										opacity: isOpened ? 1 : 0,
									}}
								/>
							</ListItemButton>
						</ListItem>
					</Tooltip>
				))}
			</List>
			{isOpened && (
				<Card
					sx={{
						maxWidth: 210,
						paddingTop: "2rem",
						borderRadius: "12px",
						backgroundColor: "#FDECF1",
						marginTop: isMobile ? "3rem" : "20rem",
						marginLeft: "1.8rem",
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<CardActionArea
						sx={{
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<CardMedia
							component="img"
							height={isMobile ? "90" : "140"}
							image="/confusion.png"
							alt="confused"
							sx={{
								width: "auto",
							}}
						/>
						<CardContent>
							<Typography
								gutterBottom
								variant="h5"
								component="div"
								style={{ textAlign: "center", color: "red", fontSize: "16px" }}
							>
								Confused?
							</Typography>
						</CardContent>
					</CardActionArea>
					<CardActions>
						<Button
							onClick={() => setShowStartTutorial(true)}
							size="small"
							style={{
								backgroundColor: "white",
								color: "black",
								borderRadius: "12px",
								fontSize: isMobile ? "12px" : "16px",
								padding: "0.6rem 0.8rem",
								marginLeft: "0.2rem",
							}}
						>
							Take a guided tour
						</Button>
					</CardActions>
				</Card>
			)}
		</Drawer>
	);
};

export default withErrorBoundary(LeftDrawer, "LeftDrawer");
