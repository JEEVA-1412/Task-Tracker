import {
    Alert,
    Button,
    Container,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
    Box,
    Paper,
    Divider,
    Fade,
    Slide,
    Zoom,
    Chip,
    Card,
    CardContent,
    CardActions,
    useTheme,
    alpha,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

interface Todo {
    _id?: string;
    task: string;
    assignedTo: string;
    status: "started" | "progress" | "completed";
}

const statusIcons = {
    started: <HourglassEmptyIcon sx={{ fontSize: 18 }} />,
    progress: <PlayArrowIcon sx={{ fontSize: 18 }} />,
    completed: <CheckCircleIcon sx={{ fontSize: 18 }} />,
};

const statusColors = {
    started: "#FFB74D", // Orange
    progress: "#4FC3F7", // Light Blue
    completed: "#81C784", // Light Green
};

export default function Todo() {
    const theme = useTheme();
    const [task, setTask] = useState<string>("");
    const [todo, setTodo] = useState<Todo[]>([]);
    const [alert, setAlert] = useState<boolean>(false);
    const [status, setStatus] = useState<"started" | "progress" | "completed">("started");
    const [assignedTo, setAssignedTo] = useState<string>("");
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [originalTask, setOriginalTask] = useState<string>("");
    const [originalStatus, setOriginalStatus] = useState<"started" | "progress" | "completed">("started");
    const [originalAssignedTo, setOriginalAssignedTo] = useState<string>("");
    const [hoveredTask, setHoveredTask] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get("http://localhost:5000/todos")
            .then((res) => setTodo(res.data))
            .catch((err) => console.error("Error fetching todos:", err));
    }, []);

    const addTodo = async () => {
        setAlert(false);

        const isDuplicate = todo.some(
            (item) => item.task.toLowerCase() === task.trim().toLowerCase()
        );

        if (isDuplicate || !task.trim() || !assignedTo.trim()) {
            setAlert(true);
            setTimeout(() => setAlert(false), 3000);
            return;
        }

        try {
            const newTodo = { task, status, assignedTo };
            const response = await axios.post("http://localhost:5000/todos", newTodo);
            setTodo([...todo, response.data]);
            setTask("");
            setAssignedTo("");
            setStatus("started");
        } catch (error) {
            console.error("Error adding todo:", error);
            setAlert(true);
            setTimeout(() => setAlert(false), 3000);
        }
    };

    const updateTodo = async () => {
        if (editingTaskId !== null) {
            try {
                const updatedTodo = { task, assignedTo, status };
                const response = await axios.put(
                    `http://localhost:5000/todos/${editingTaskId}`,
                    updatedTodo
                );
                setTodo(todo.map((t) => (t._id === editingTaskId ? response.data : t)));
                setTask("");
                setAssignedTo("");
                setStatus("started");
                setEditingTaskId(null);
            } catch (error) {
                console.error("Error updating todo:", error);
            }
        } else {
            setAlert(true);
            setTimeout(() => setAlert(false), 3000);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/todos/${id}`);
            setTodo(todo.filter((t) => t._id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleEdit = (
        id: string,
        task: string,
        assignedTo: string,
        status: "started" | "progress" | "completed"
    ) => {
        setTask(task);
        setAssignedTo(assignedTo);
        setStatus(status);

        setOriginalTask(task);
        setOriginalStatus(status);
        setOriginalAssignedTo(assignedTo);

        setEditingTaskId(id);
    };

    const isUnchanged =
        task === originalTask &&
        status === originalStatus &&
        assignedTo === originalAssignedTo;

    return (
        <Fade in timeout={800}>
            <Container maxWidth="lg">
                <Zoom in timeout={600}>
                    <Paper
                        elevation={24}
                        sx={{
                            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                            borderRadius: "2.5rem",
                            padding: { xs: 3, sm: 6, md: 6 },
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "4px",
                                background: "linear-gradient(90deg, #e94560, #533483)",
                            },
                        }}
                    >
                        {/* Header Section */}
                        <Box textAlign="center" mb={4}>
                            <Typography
                                variant="h2"
                                gutterBottom
                                sx={{
                                    fontWeight: "800",
                                    background: "linear-gradient(135deg, #e94560, #533483)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                    fontSize: { xs: "2.5rem", sm: "3.5rem" },
                                    mb: 2,
                                }}
                            >
                                Task Tracker
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    fontWeight: "300",
                                    fontSize: { xs: "1rem", sm: "1.25rem" },
                                    maxWidth: "600px",
                                    mx: "auto",
                                    lineHeight: 1.6,
                                }}
                            >
                                Streamline your workflow, track progress in real-time, and achieve more with style 🚀
                            </Typography>
                        </Box>

                        {/* Input Section */}
                        <Slide in timeout={800} direction="up">
                            <Box
                                sx={{
                                    background: "linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(83, 52, 131, 0.1))",
                                    borderRadius: "2rem",
                                    p: 4,
                                    mb: 4,
                                    border: "1px solid rgba(233, 69, 96, 0.2)",
                                }}
                            >
                                <Box display="grid" gap={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Task Name"
                                        value={task}
                                        onChange={(e) => setTask(e.target.value)}
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "1.5rem",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                transition: "all 0.3s ease",
                                                color: "white",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 8px 25px rgba(233, 69, 96, 0.2)",
                                                },
                                                "&.Mui-focused": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 8px 25px rgba(233, 69, 96, 0.3)",
                                                },
                                                "& fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.3)",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "rgba(233, 69, 96, 0.5)",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#e94560",
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "rgba(255, 255, 255, 0.7)",
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#e94560",
                                            },
                                        }}
                                    />

                                    <TextField
                                        variant="outlined"
                                        label="Assigned To"
                                        value={assignedTo}
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "1.5rem",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                transition: "all 0.3s ease",
                                                color: "white",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 8px 25px rgba(233, 69, 96, 0.2)",
                                                },
                                                "&.Mui-focused": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 8px 25px rgba(233, 69, 96, 0.3)",
                                                },
                                                "& fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.3)",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "rgba(233, 69, 96, 0.5)",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#e94560",
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "rgba(255, 255, 255, 0.7)",
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#e94560",
                                            },
                                        }}
                                    />

                                    <Select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value as "started" | "progress" | "completed")
                                        }
                                        fullWidth
                                        sx={{
                                            borderRadius: "1.5rem",
                                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                                            transition: "all 0.3s ease",
                                            color: "white",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 8px 25px rgba(233, 69, 96, 0.2)",
                                            },
                                            "&.Mui-focused": {
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 8px 25px rgba(233, 69, 96, 0.3)",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgba(255, 255, 255, 0.3)",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgba(233, 69, 96, 0.5)",
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#e94560",
                                            },
                                            "& .MuiSelect-icon": {
                                                color: "rgba(255, 255, 255, 0.7)",
                                            },
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: "#1a1a2e",
                                                    color: "white",
                                                    borderRadius: "1rem",
                                                    marginTop: 1,
                                                    "& .MuiMenuItem-root": {
                                                        "&:hover": {
                                                            backgroundColor: "rgba(233, 69, 96, 0.2)",
                                                        },
                                                        "&.Mui-selected": {
                                                            backgroundColor: "rgba(233, 69, 96, 0.3)",
                                                        },
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="started">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <HourglassEmptyIcon sx={{ color: statusColors.started, fontSize: 20 }} />
                                                <Typography sx={{ color: "white" }}>Started</Typography>
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="progress">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PlayArrowIcon sx={{ color: statusColors.progress, fontSize: 20 }} />
                                                <Typography sx={{ color: "white" }}>In Progress</Typography>
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="completed">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <CheckCircleIcon sx={{ color: statusColors.completed, fontSize: 20 }} />
                                                <Typography sx={{ color: "white" }}>Completed</Typography>
                                            </Box>
                                        </MenuItem>
                                    </Select>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={editingTaskId ? <EditIcon /> : <AddIcon />}
                                        sx={{
                                            py: 2,
                                            fontWeight: "700",
                                            fontSize: "1.1rem",
                                            borderRadius: "1.5rem",
                                            background: editingTaskId
                                                ? "linear-gradient(135deg, #FF8A65, #FF5722)"
                                                : "linear-gradient(135deg, #e94560, #533483)",
                                            color: "white",
                                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "&:hover": {
                                                transform: "translateY(-3px) scale(1.02)",
                                                boxShadow: editingTaskId
                                                    ? "0 15px 30px rgba(255, 87, 34, 0.4)"
                                                    : "0 15px 30px rgba(233, 69, 96, 0.4)",
                                                background: editingTaskId
                                                    ? "linear-gradient(135deg, #FF7043, #F4511E)"
                                                    : "linear-gradient(135deg, #d32f2f, #4527a0)",
                                            },
                                            "&:active": {
                                                transform: "translateY(-1px)",
                                            },
                                            "&.Mui-disabled": {
                                                transform: "none",
                                                opacity: 0.6,
                                            },
                                        }}
                                        onClick={editingTaskId !== null ? updateTodo : addTodo}
                                        disabled={isUnchanged && editingTaskId !== null}
                                    >
                                        {editingTaskId ? "Update Task" : "Add New Task"}
                                    </Button>

                                    {/* Alert moved here - below the button */}
                                    {alert && (
                                        <Zoom in timeout={500}>
                                            <Alert
                                                severity="warning"
                                                sx={{
                                                    borderRadius: "1.5rem",
                                                    fontWeight: "500",
                                                    boxShadow: "0 8px 25px rgba(255, 152, 0, 0.3)",
                                                    border: "1px solid rgba(255, 152, 0, 0.3)",
                                                    mt: 1,
                                                    backgroundColor: "rgba(255, 152, 0, 0.1)",
                                                    color: "white",
                                                    "& .MuiAlert-icon": {
                                                        color: "#FFB74D",
                                                    },
                                                }}
                                            >
                                                Please fill all fields and ensure no duplicate tasks exist ⚠️
                                            </Alert>
                                        </Zoom>
                                    )}
                                </Box>
                            </Box>
                        </Slide>

                        <Divider sx={{ mb: 4, opacity: 0.3, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

                        {/* Todo List */}
                        <Box sx={{ pr: 1 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "600",
                                    color: "rgba(255, 255, 255, 0.9)",
                                    mb: 3,
                                    textAlign: "center",
                                }}
                            >
                                Your Tasks ({todo.length})
                            </Typography>

                            {todo.length === 0 ? (
                                <Fade in timeout={800}>
                                    <Box
                                        textAlign="center"
                                        sx={{
                                            py: 4,
                                            color: "rgba(255, 255, 255, 0.7)",
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2, color: "#81C784" }} />
                                        <Typography variant="h6" gutterBottom>
                                            No tasks yet
                                        </Typography>
                                        <Typography variant="body1">
                                            Add your first task to get started!
                                        </Typography>
                                    </Box>
                                </Fade>
                            ) : (
                                <Box display="grid" gap={2}>
                                    {todo.map((item, index) => (
                                        <Slide
                                            in
                                            timeout={800 + index * 100}
                                            direction="up"
                                            key={item._id}
                                        >
                                            <Card
                                                elevation={hoveredTask === item._id ? 8 : 2}
                                                onMouseEnter={() => setHoveredTask(item._id!)}
                                                onMouseLeave={() => setHoveredTask(null)}
                                                sx={{
                                                    borderRadius: "1.5rem",
                                                    overflow: "visible",
                                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    transform: hoveredTask === item._id ? "translateY(-4px)" : "translateY(0)",
                                                    border: `2px solid ${alpha(statusColors[item.status], 0.2)}`,
                                                    background: "linear-gradient(135deg, rgba(40, 40, 60, 0.8), rgba(30, 30, 50, 0.9))",
                                                    backdropFilter: "blur(10px)",
                                                    position: "relative",
                                                    "&::before": {
                                                        content: '""',
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: "4px",
                                                        background: `linear-gradient(90deg, ${statusColors[item.status]}, ${alpha(statusColors[item.status], 0.5)})`,
                                                        borderTopLeftRadius: "1.5rem",
                                                        borderTopRightRadius: "1.5rem",
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ p: 3, pb: 1 }}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="flex-start"
                                                        gap={2}
                                                    >
                                                        <Box flex={1} sx={{ minWidth: 0 }}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontWeight: "800",
                                                                    color: "rgba(255, 255, 255, 0.95)",
                                                                    mb: 1.5,
                                                                    lineHeight: 1.4,
                                                                    fontSize: "1.3rem",
                                                                    wordBreak: "break-word",
                                                                }}
                                                            >
                                                                {item.task}
                                                            </Typography>
                                                            <Box display="flex" flexDirection="column" gap={1}>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <PersonIcon sx={{ fontSize: 20, color: "rgba(255, 255, 255, 0.7)" }} />
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "600", fontSize: "1rem" }}
                                                                    >
                                                                        {item.assignedTo}
                                                                    </Typography>
                                                                </Box>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <AssignmentIcon sx={{ fontSize: 20, color: "rgba(255, 255, 255, 0.7)" }} />
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "600", fontSize: "1rem" }}
                                                                    >
                                                                        Task: {item.task}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                                                            <Chip
                                                                icon={statusIcons[item.status]}
                                                                label={item.status}
                                                                sx={{
                                                                    backgroundColor: alpha(statusColors[item.status], 0.15),
                                                                    color: statusColors[item.status],
                                                                    fontWeight: "800",
                                                                    borderRadius: "1rem",
                                                                    border: `1px solid ${alpha(statusColors[item.status], 0.4)}`,
                                                                    textTransform: "capitalize",
                                                                    px: 1,
                                                                    height: '36px',
                                                                    '& .MuiChip-label': {
                                                                        fontSize: '0.9rem',
                                                                        px: 1,
                                                                    },
                                                                    '& .MuiChip-icon': {
                                                                        fontSize: '1.1rem',
                                                                    },
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </CardContent>

                                                <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end", gap: 0.5 }}>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEdit(
                                                                item._id!,
                                                                item.task,
                                                                item.assignedTo,
                                                                item.status
                                                            )
                                                        }
                                                        size="medium"
                                                        sx={{
                                                            backgroundColor: alpha("#4FC3F7", 0.1),
                                                            color: "#4FC3F7",
                                                            transition: "all 0.3s ease",
                                                            "&:hover": {
                                                                backgroundColor: "#4FC3F7",
                                                                color: "white",
                                                                transform: "scale(1.1)",
                                                            },
                                                        }}
                                                    >
                                                        <EditIcon fontSize="medium" />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => deleteTodo(item._id!)}
                                                        size="medium"
                                                        sx={{
                                                            backgroundColor: alpha("#e94560", 0.1),
                                                            color: "#e94560",
                                                            transition: "all 0.3s ease",
                                                            "&:hover": {
                                                                backgroundColor: "#e94560",
                                                                color: "white",
                                                                transform: "scale(1.1)",
                                                            },
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="medium" />
                                                    </IconButton>
                                                </CardActions>
                                            </Card>
                                        </Slide>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Zoom>
            </Container>
        </Fade>
    );
}