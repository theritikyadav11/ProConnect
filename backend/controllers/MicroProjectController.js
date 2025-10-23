import MicroProject from "../models/MicroProject.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Message from "../models/Message.js"; // Import Message model

// Helper function to calculate project progress
const calculateProjectProgress = async (projectId) => {
  const tasks = await Task.find({ microProject: projectId });
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  return (completedTasks / tasks.length) * 100;
};

// @desc    Create a new Micro Project
// @route   POST /api/microprojects
// @access  Private
const createMicroProject = async (req, res) => {
  const {
    title,
    description,
    skillsRequired,
    duration,
    collaborators,
    visibility,
  } = req.body;
  const creator = req.user._id; // Assuming req.user is populated by auth middleware

  try {
    const microProject = new MicroProject({
      title,
      description,
      skillsRequired,
      duration,
      creator,
      collaborators: [creator, ...collaborators], // Creator is also a collaborator
      visibility,
    });

    const createdProject = await microProject.save();

    // Add project to creator's microProjects
    await User.findByIdAndUpdate(creator, {
      $push: { microProjects: createdProject._id },
    });

    // Send notifications to invited collaborators
    for (const collaboratorId of collaborators) {
      if (collaboratorId.toString() !== creator.toString()) {
        await Notification.create({
          recipient: collaboratorId,
          sender: creator,
          type: "project_invite",
          message: `${req.user.name} has invited you to join the micro project '${title}' as a collaborator.`,
          link: `/microproject/${createdProject._id}`,
          microProject: createdProject._id,
        });
      }
    }

    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single Micro Project by ID
// @route   GET /api/microprojects/:id
// @access  Private
const getMicroProject = async (req, res) => {
  try {
    const microProject = await MicroProject.findById(req.params.id)
      .populate("creator", "name uname profilePicture")
      .populate("collaborators", "name uname profilePicture")
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "name uname profilePicture",
        },
      });

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Check if the user is a collaborator or the creator
    const isAuthorized =
      microProject.creator._id.toString() === req.user._id.toString() ||
      microProject.collaborators.some(
        (collab) => collab._id.toString() === req.user._id.toString()
      );

    if (!isAuthorized && microProject.visibility === "private") {
      return res
        .status(403)
        .json({ message: "Not authorized to access this project" });
    }

    res.json(microProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a Micro Project
// @route   PUT /api/microprojects/:id
// @access  Private
const updateMicroProject = async (req, res) => {
  const {
    title,
    description,
    skillsRequired,
    duration,
    collaborators,
    status,
    visibility,
  } = req.body;

  try {
    const microProject = await MicroProject.findById(req.params.id);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Only creator can update project details (except task status/progress handled separately)
    if (microProject.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this project" });
    }

    microProject.title = title || microProject.title;
    microProject.description = description || microProject.description;
    microProject.skillsRequired = skillsRequired || microProject.skillsRequired;
    microProject.duration = duration || microProject.duration;
    microProject.visibility = visibility || microProject.visibility;

    // Handle updating collaborators (add new and remove old)
    const oldCollaboratorIds = microProject.collaborators.map((c) =>
      c.toString()
    );
    const newCollaboratorIds = collaborators.map((c) => c.toString());

    // Collaborators to add
    const collaboratorsToAdd = newCollaboratorIds.filter(
      (cId) => !oldCollaboratorIds.includes(cId)
    );
    for (const newCollabId of collaboratorsToAdd) {
      await User.findByIdAndUpdate(newCollabId, {
        $push: { microProjects: microProject._id },
      });
      await Notification.create({
        recipient: newCollabId,
        sender: req.user._id,
        type: "project_invite",
        message: `${req.user.name} has invited you to join the micro project '${microProject.title}' as a collaborator.`,
        link: `/microproject/${microProject._id}`,
        microProject: microProject._id,
      });
    }

    // Collaborators to remove
    const collaboratorsToRemove = oldCollaboratorIds.filter(
      (cId) =>
        !newCollaboratorIds.includes(cId) &&
        cId !== microProject.creator.toString() // Cannot remove creator
    );
    for (const removedCollabId of collaboratorsToRemove) {
      await User.findByIdAndUpdate(removedCollabId, {
        $pull: { microProjects: microProject._id },
      });
      // Optionally send a notification for removal
    }

    microProject.collaborators = collaborators; // Update the project's collaborators array

    // Update status if provided and valid
    if (status && ["pending", "active", "completed"].includes(status)) {
      microProject.status = status;
    }

    const updatedProject = await microProject.save();

    // Recalculate progress if tasks were updated (though task updates are handled by updateTask)
    updatedProject.progress = await calculateProjectProgress(
      updatedProject._id
    );
    await updatedProject.save();

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Invite collaborator to a Micro Project
// @route   POST /api/microprojects/:id/invite
// @access  Private (Creator only)
const inviteCollaborator = async (req, res) => {
  const { collaboratorId } = req.body;
  const projectId = req.params.id;

  try {
    const microProject = await MicroProject.findById(projectId);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    if (microProject.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the creator can invite collaborators" });
    }

    if (microProject.collaborators.includes(collaboratorId)) {
      return res
        .status(400)
        .json({ message: "User is already a collaborator" });
    }

    // Add to collaborators array and send notification
    microProject.collaborators.push(collaboratorId);
    await microProject.save();

    await User.findByIdAndUpdate(collaboratorId, {
      $push: { microProjects: projectId },
    });

    await Notification.create({
      recipient: collaboratorId,
      sender: req.user._id,
      type: "project_invite",
      message: `${req.user.name} has invited you to join the micro project '${microProject.title}' as a collaborator.`,
      link: `/microproject/${projectId}`,
      microProject: projectId,
    });

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Collaborator accepts project invitation
// @route   POST /api/microprojects/:id/accept
// @access  Private (Invited user only)
const acceptCollaboration = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;

  try {
    const microProject = await MicroProject.findById(projectId);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Check if the user was actually invited (is in collaborators array)
    if (!microProject.collaborators.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not invited to this project" });
    }

    // For now, just confirm they are a collaborator.
    // In a more complex system, you might have a separate 'pending_collaborators' array
    // and move them to 'active_collaborators' upon acceptance.
    // For this implementation, being in 'collaborators' means they are part of it.

    // Remove any pending invitation notifications for this project and user
    await Notification.deleteMany({
      recipient: userId,
      microProject: projectId,
      type: "project_invite",
    });

    res.status(200).json({ message: "Collaboration accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Collaborator declines project invitation
// @route   POST /api/microprojects/:id/decline
// @access  Private (Invited user only)
const declineCollaboration = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;

  try {
    const microProject = await MicroProject.findById(projectId);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Check if the user was actually invited
    if (!microProject.collaborators.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not invited to this project" });
    }

    // Remove user from collaborators list
    microProject.collaborators = microProject.collaborators.filter(
      (collab) => collab.toString() !== userId.toString()
    );
    await microProject.save();

    // Remove project from user's microProjects
    await User.findByIdAndUpdate(userId, {
      $pull: { microProjects: projectId },
    });

    // Remove any pending invitation notifications for this project and user
    await Notification.deleteMany({
      recipient: userId,
      microProject: projectId,
      type: "project_invite",
    });

    res.status(200).json({ message: "Collaboration declined" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new task to a Micro Project
// @route   POST /api/microprojects/:id/tasks
// @access  Private (Collaborators only)
const addTask = async (req, res) => {
  const { description, assignedTo } = req.body;
  const projectId = req.params.id;

  try {
    const microProject = await MicroProject.findById(projectId);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Check if user is a collaborator
    if (
      !microProject.collaborators.some(
        (collab) => collab.toString() === req.user._id.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to add tasks to this project" });
    }

    const task = new Task({
      microProject: projectId,
      description,
      assignedTo: assignedTo || req.user._id, // Assign to creator if not specified
    });

    const createdTask = await task.save();

    microProject.tasks.push(createdTask._id);
    microProject.progress = await calculateProjectProgress(projectId);
    await microProject.save();

    // Notify assigned user if different from current user
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        type: "project_update",
        message: `${req.user.name} assigned you a new task in '${microProject.title}': ${description}`,
        link: `/microproject/${projectId}`,
        microProject: projectId,
      });
    }

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task within a Micro Project
// @route   PUT /api/tasks/:id
// @access  Private (Assigned user or project creator)
const updateTask = async (req, res) => {
  const { description, assignedTo, status } = req.body;
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const microProject = await MicroProject.findById(task.microProject);

    // Check if user is assigned to task, is project creator, or is a collaborator
    const isAuthorized =
      task.assignedTo.toString() === req.user._id.toString() ||
      microProject.creator.toString() === req.user._id.toString() ||
      microProject.collaborators.some(
        (collab) => collab.toString() === req.user._id.toString()
      );

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;

    const updatedTask = await task.save();

    // Recalculate project progress
    microProject.progress = await calculateProjectProgress(microProject._id);
    await microProject.save();

    // Notify relevant parties about task update
    if (status === "completed") {
      await Notification.create({
        recipient: microProject.creator,
        sender: req.user._id,
        type: "project_update",
        message: `${req.user.name} completed a task in '${microProject.title}': ${task.description}`,
        link: `/microproject/${microProject._id}`,
        microProject: microProject._id,
      });
    } else if (
      assignedTo &&
      assignedTo.toString() !== req.user._id.toString()
    ) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        type: "project_update",
        message: `${req.user.name} updated your task in '${microProject.title}': ${task.description}`,
        link: `/microproject/${microProject._id}`,
        microProject: microProject._id,
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a Micro Project as completed
// @route   POST /api/microprojects/:id/complete
// @access  Private (All collaborators must confirm)
const completeMicroProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;

  try {
    const microProject = await MicroProject.findById(projectId);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Check if user is a collaborator
    if (
      !microProject.collaborators.some(
        (collab) => collab.toString() === userId.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to complete this project" });
    }

    // For simplicity, let's assume only the creator can mark it as completed for now.
    // A more complex system would involve a 'confirmations' array on the project.
    if (microProject.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the project creator can mark it as completed.",
      });
    }

    microProject.status = "completed";
    microProject.progress = 100; // Ensure progress is 100% on completion
    const completedProject = await microProject.save();

    // Add project to all collaborators' achievements
    for (const collaboratorId of completedProject.collaborators) {
      await User.findByIdAndUpdate(collaboratorId, {
        $push: { achievements: completedProject._id },
      });
      await Notification.create({
        recipient: collaboratorId,
        sender: userId,
        type: "project_completed",
        message: `Congratulations! The micro project '${completedProject.title}' has been completed. It's now in your achievements!`,
        link: `/microproject/${completedProject._id}`,
        microProject: completedProject._id,
      });
    }

    res.json(completedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Micro Projects for a user
// @route   GET /api/microprojects/user/:userId
// @access  Private
const getUserMicroProjects = async (req, res) => {
  try {
    const userProjects = await MicroProject.find({
      collaborators: req.params.userId,
      status: { $ne: "completed" }, // Exclude completed projects
    })
      .populate("creator", "name uname profilePicture")
      .populate("collaborators", "name uname profilePicture")
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "name uname profilePicture",
        },
      });

    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get achievements for a user
// @route   GET /api/microprojects/user/:userId/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "achievements",
      populate: [
        { path: "creator", select: "name uname profilePicture" },
        { path: "collaborators", select: "name uname profilePicture" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project discussion messages
// @route   GET /api/microprojects/:id/discussion
// @access  Private (Collaborators only)
const getProjectDiscussion = async (req, res) => {
  try {
    const microProject = await MicroProject.findById(req.params.id);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Check if user is a collaborator
    if (
      !microProject.collaborators.some(
        (collab) => collab.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({
        message: "Not authorized to view discussion for this project",
      });
    }

    const messages = await Message.find({ microProject: req.params.id })
      .populate("sender", "name uname profilePicture")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message in project discussion
// @route   POST /api/microprojects/:id/discussion
// @access  Private (Collaborators only)
const sendProjectMessage = async (req, res) => {
  const { content } = req.body;
  const projectId = req.params.id;
  const sender = req.user._id;

  try {
    const microProject = await MicroProject.findById(projectId);

    if (!microProject) {
      return res.status(404).json({ message: "Micro Project not found" });
    }

    // Check if user is a collaborator
    if (
      !microProject.collaborators.some(
        (collab) => collab.toString() === req.user._id.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to send messages in this project" });
    }

    const message = new Message({
      microProject: projectId,
      sender,
      content,
    });

    const createdMessage = await message.save();

    // Optionally, notify other collaborators about new message
    for (const collaboratorId of microProject.collaborators) {
      if (collaboratorId.toString() !== sender.toString()) {
        await Notification.create({
          recipient: collaboratorId,
          sender: sender,
          type: "project_message",
          message: `${req.user.name} sent a message in '${microProject.title}' discussion.`,
          link: `/microproject/${projectId}/chat`, // Assuming a chat route
          microProject: projectId,
        });
      }
    }

    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createMicroProject,
  getMicroProject,
  updateMicroProject,
  inviteCollaborator,
  acceptCollaboration,
  declineCollaboration,
  addTask,
  updateTask,
  completeMicroProject,
  getUserMicroProjects,
  getUserAchievements,
  getProjectDiscussion,
  sendProjectMessage,
};
