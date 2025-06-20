import React, { useEffect, useState } from 'react';
import CategoryModal from './CategoryModal';
import { useCurrentUser } from '../../hooks';
import { useUserCategories } from '../../hooks';

const UserCategoryGate = () => {
  const { currentUser } = useCurrentUser();
  const { userCategories, loading} = useUserCategories();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser || loading) return;

    const storageKey = `modalShown_${currentUser.user_id}`;
    const alreadyShown = localStorage.getItem(storageKey);

    if (!alreadyShown && userCategories.length === 0) {
      setShowModal(true);
    }
  }, [currentUser, userCategories, loading]);

  const handleClose = () => {
    if (currentUser) {
      localStorage.setItem(`modalShown_${currentUser.user_id}`, 'true');
    }
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <CategoryModal
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default UserCategoryGate;
