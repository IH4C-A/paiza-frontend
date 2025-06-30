import { useState, useEffect } from "react";
import type { Plant } from "../types/plantType";

export const usePlants = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlants = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/plants');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Plant[] = await response.json();
            setPlants(data);
        } catch (error) {
            console.error('Error fetching plants:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    return { plants, loading, error, refetch: fetchPlants };
}

// ユーザーの植物単体取得
export const usePlant = () => {
    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlant = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/plant',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Plant = await response.json();
            setPlant(data);
        } catch (error) {
            console.error('Error fetching plant:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlant();
    }, []);

    return { plant, loading, error, refetch: fetchPlant };
}

// ユーザーの植物登録
export const useRegisterPlant = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("token");

    const registerPlant = async (plantData: {
        growth_stage: string;
        mood: string;
        plant_name: string;
        color: string;
        size: number;
        motivation_style: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/plant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(plantData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error registering plant:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerPlant };
}

// ユーザーの植物更新
export const useUpdatePlant = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updatePlant = async (plantData: {
        growth_stage: string;
        mood: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/plant', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(plantData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error updating plant:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, updatePlant };
}

// ユーザーの植物単体取得
export const useUserPlant = (id: string) => {
    const [userplant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlant = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/plant_user/${id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Plant = await response.json();
            setPlant(data);
        } catch (error) {
            console.error('Error fetching plant:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlant();
    }, []);

    return { userplant, loading, error, refetch: fetchPlant };
}