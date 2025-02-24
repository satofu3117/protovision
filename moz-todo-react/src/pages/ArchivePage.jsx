// ArchivePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ArchivePage.css';

const dummyData = {
  private: [
    { experiment: "実験A", generatedAt: "2025-01-01 10:00", user: "User1", updatedAt: "2025-01-02 11:00" },
    { experiment: "実験B", generatedAt: "2025-01-03 12:00", user: "User2", updatedAt: "2025-01-04 13:00" },
    { experiment: "実験C", generatedAt: "2025-01-05 14:00", user: "User3", updatedAt: "2025-01-06 15:00" }
  ],
  public: [
    { experiment: "実験D", generatedAt: "2025-02-01 10:00", user: "User4", updatedAt: "2025-02-02 11:00" },
    { experiment: "実験E", generatedAt: "2025-02-03 12:00", user: "User5", updatedAt: "2025-02-04 13:00" },
    { experiment: "実験F", generatedAt: "2025-02-05 14:00", user: "User6", updatedAt: "2025-02-06 15:00" }
  ]
};

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState('private');
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleChange = (e) => {
    setActiveTab(e.target.checked ? 'public' : 'private');
    setSearchQuery(""); // タブ切り替え時は検索内容をリセット
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = dummyData[activeTab].filter((item) => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      item.experiment.toLowerCase().includes(query) ||
      item.generatedAt.toLowerCase().includes(query) ||
      item.user.toLowerCase().includes(query) ||
      item.updatedAt.toLowerCase().includes(query)
    );
  });

  const renderTableRows = () => {
    return filteredData.map((item, index) => (
      <tr key={index}>
        <td>
          <Link 
            to="/video" 
            state={{ 
              experiment: item.experiment, 
              generatedAt: item.generatedAt, 
              caption: "ここに実験手順の詳細キャプションが表示されます。" 
            }}
          >
            {item.experiment}
          </Link>
        </td>
        <td>{item.generatedAt}</td>
        <td>{item.user}</td>
        <td>{item.updatedAt}</td>
      </tr>
    ));
  };

  return (
    <div className="archive-page">
      <div className="archive-header">
        <h2>Archive</h2>
        <div className="toggle-switch">
          <label className="switch">
            <input 
              type="checkbox" 
              checked={activeTab === 'public'} 
              onChange={handleToggleChange} 
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">
            {activeTab === 'private' ? 'Private' : 'Public'}
          </span>
        </div>
      </div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>実験名</th>
              <th>生成日時</th>
              <th>ユーザー名</th>
              <th>最終更新日</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArchivePage;