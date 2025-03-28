'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAgents, searchAgentByName, Agent } from '../services/agentService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function SearchAgent() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Load agents with pagination
  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await fetchAgents(page, pageSize);
      setAgents(data.agents);
      setTotalPages(Math.ceil(data.total / pageSize) || 1);
      setError('');
    } catch (err) {
      console.error('Error loading agents:', err);
      setError('Failed to load agents. Please try again later.');
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  // Search for a specific agent
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      loadAgents();
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchAgentByName(searchTerm);
      setAgents(results);
      setTotalPages(1); // Reset pagination for search results
      setError('');
    } catch (err) {
      console.error('Error searching for agent:', err);
      setError('Agent not found or error occurred during search.');
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load agents when component mounts or page changes
  useEffect(() => {
    if (!searchTerm) {
      loadAgents();
    }
  }, [page]);

  // Handle page navigation
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Format date string to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Search Agents</h1>
        <Link href="/">
          <button className="bg-gray-200 px-4 py-2 rounded-lg text-black">
            Back to Home
          </button>
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by agent name"
          className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              loadAgents();
            }}
            className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>
        )}
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading Message */}
      {loading && <LoadingSpinner />}

      {/* Agents Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agents.length > 0 ? (
              agents.map((agent, index) => (
                <tr key={`${agent.agent_name}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link href={`/agent-detail/${encodeURIComponent(agent.agent_name)}`} className="text-blue-600 hover:underline">
                      {agent.agent_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.subject_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(agent.created_at)}
                  </td>
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td colSpan={3} className="px-6 py-4">
                  <EmptyState 
                    message={searchTerm ? `No agents found for "${searchTerm}"` : "No agents available"}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!searchTerm && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className={`px-4 py-2 rounded-lg ${
                page <= 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className={`px-4 py-2 rounded-lg ${
                page >= totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 