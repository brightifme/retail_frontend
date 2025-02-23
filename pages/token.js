import React from 'react';

const RemoveTokenButton = () => {
  const handleRemoveToken = () => {
    localStorage.removeItem('retailBusinessId');
    alert('Token removed!');
  };

  return (
    <button onClick={handleRemoveToken}>Remove Token</button>
  );
};

export default RemoveTokenButton;