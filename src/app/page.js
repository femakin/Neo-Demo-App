"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setloading] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Planned",
    start_date: "",
    end_date: "",
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    // Fetch projects from API
    // setloading(true);
    fetch(`${process.env.NEXT_PUBLIC_DB_DEV}/projects`) // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setloading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setloading(false); // Set loading to false in case of an error
      });
  }, [loading]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddProject = (e) => {
    // Send a request to create a new project
    setloading(true);
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_DB_DEV}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setloading(false);
        setProjects((prevProjects) => [...prevProjects, data]);
        // Reset the new project form
        setNewProject({
          name: "",
          description: "",
          status: "Planned",
          start_date: "",
          end_date: "",
        });
        formRef.current.reset();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error creating project:", error);
        setloading(false);
      });
  };

  const fetchProjects = () => {
    setloading(true);
    fetch(`${process.env.NEXT_PUBLIC_DB_DEV}/projects`)
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setloading(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setloading(false);
      });
  };

  const handleDeleteProject = (projectId) => {
    setloading(true);
    fetch(`${process.env.NEXT_PUBLIC_DB_DEV}/projects?id=eq.${projectId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setloading(false);
        // Update the projects list by removing the deleted project
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId),
        );
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
        setloading(false);
      });
  };

  const handleUpdateProject = (projectId, updatedValues) => {
    setloading(true);
    fetch(`${process.env.NEXT_PUBLIC_DB_DEV}/projects?id=eq.${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedValues),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setloading(false);
        // fetchProjects();
        setShowUpdateModal(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating project:', error);
        setloading(false);
      });
  };

  const handleShowUpdateModal = (projectId) => {
    const selectedProject = projects.find(
      (project) => project.id === projectId,
    );
    if (selectedProject) {
      setSelectedProjectId(projectId);
      setNewProject(selectedProject);
      setShowUpdateModal(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-4xl font-bold mb-8">Project Management App</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <p>Fetching data...</p>
        ) : (
          <>
            {projects.map((project) => (
              <div key={project.id} className="border rounded p-4 shadow-md">
                <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-sm mt-2">Status: {project.status}</p>
                <p className="text-sm">Start Date: {project.start_date}</p>
                <p className="text-sm">End Date: {project.end_date}</p>
                <p className="text-sm">ID: {project.id}</p>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </button>

                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => handleShowUpdateModal(project.id)}
                >
                  Update
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add New Project Form */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
        <form
          className="flex flex-wrap gap-12"
          onSubmit={handleAddProject}

        >
          <div className="flex flex-col mb-4 w-full sm:w-1/2 md:w-1/3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProject.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="flex flex-col mb-4 w-full sm:w-1/2 md:w-1/3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="flex flex-col mb-4 w-full sm:w-1/2 md:w-1/3">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={newProject.status}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col mb-4 w-full sm:w-1/2 md:w-1/3">
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={newProject.start_date}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="flex flex-col mb-4 w-full sm:w-1/2 md:w-1/3">
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={newProject.end_date}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="w-full">
            {loading ? (
              // Render loading state when isLoading is true
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-not-allowed opacity-50"
                disabled
              >
                Loading...
              </button>
            ) : (
              // Render submit button when isLoading is false
              <input
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              />
            )}
          </div>
        </form>
      </div>

      <div>
        {showUpdateModal && (
          <div
            id="update-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-4 md:p-5 border rounded dark:bg-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Update Project
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProject(selectedProjectId, newProject);
                }}
              >
                <div className="flex flex-col mb-4 w-full ">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="flex flex-col mb-4 w-full ">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newProject.status}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    required
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
