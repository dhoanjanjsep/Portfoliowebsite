import { DevLog, CreateDevLogData, UpdateDevLogData } from './supabase'

// 개발 일지 생성
export const createDevLog = async (logData: CreateDevLogData): Promise<{ data: DevLog | null; error: any }> => {
  try {
    const response = await fetch('/api/dev-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create dev log');
    }

    const data = await response.json();
    
    // 서버 응답을 DevLog 타입으로 변환
    const devLog: DevLog = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags,
      imageUrl: data.image_url,
      views: data.views || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
    
    return { data: devLog, error: null }
  } catch (error) {
    console.error('Error creating dev log:', error)
    return { data: null, error }
  }
}

// 모든 개발 일지 조회
export const getAllDevLogs = async (): Promise<{ data: DevLog[] | null; error: any }> => {
  try {
    const response = await fetch('/api/dev-logs');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dev logs');
    }

    const data = await response.json();
    
    // 서버 응답을 DevLog 타입으로 변환
    const devLogs: DevLog[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags,
      imageUrl: item.image_url,
      views: item.views || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
    
    return { data: devLogs, error: null }
  } catch (error) {
    console.error('Error fetching dev logs:', error)
    return { data: null, error }
  }
}

// 특정 개발 일지 조회
export const getDevLogById = async (id: string): Promise<{ data: DevLog | null; error: any }> => {
  try {
    const response = await fetch(`/api/dev-logs/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dev log');
    }

    const data = await response.json();
    
    // 서버 응답을 DevLog 타입으로 변환
    const devLog: DevLog = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags,
      imageUrl: data.image_url,
      views: data.views || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
    
    return { data: devLog, error: null }
  } catch (error) {
    console.error('Error fetching dev log:', error)
    return { data: null, error }
  }
}

// 개발 일지 수정
export const updateDevLog = async (id: string, updateData: UpdateDevLogData): Promise<{ data: DevLog | null; error: any }> => {
  try {
    const response = await fetch(`/api/dev-logs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update dev log');
    }

    const data = await response.json();
    
    // 서버 응답을 DevLog 타입으로 변환
    const devLog: DevLog = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags,
      imageUrl: data.image_url,
      views: data.views || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
    
    return { data: devLog, error: null }
  } catch (error) {
    console.error('Error updating dev log:', error)
    return { data: null, error }
  }
}

// 개발 일지 삭제
export const deleteDevLog = async (id: string): Promise<{ error: any }> => {
  try {
    const response = await fetch(`/api/dev-logs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete dev log');
    }

    return { error: null }
  } catch (error) {
    console.error('Error deleting dev log:', error)
    return { error }
  }
}

// 조회수 증가
export const incrementViews = async (id: string): Promise<{ error: any }> => {
  try {
    const response = await fetch(`/api/dev-logs/${id}/views`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to increment views');
    }

    return { error: null }
  } catch (error) {
    console.error('Error incrementing views:', error)
    return { error }
  }
}

// 카테고리별 개발 일지 조회
export const getDevLogsByCategory = async (category: string): Promise<{ data: DevLog[] | null; error: any }> => {
  try {
    const response = await fetch(`/api/dev-logs?category=${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dev logs by category');
    }

    const data = await response.json();
    
    // 서버 응답을 DevLog 타입으로 변환
    const devLogs: DevLog[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags,
      imageUrl: item.image_url,
      views: item.views || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
    
    return { data: devLogs, error: null }
  } catch (error) {
    console.error('Error fetching dev logs by category:', error)
    return { data: null, error }
  }
}

// 태그별 개발 일지 검색
export const searchDevLogsByTags = async (tags: string[]): Promise<{ data: DevLog[] | null; error: any }> => {
  try {
    const response = await fetch(`/api/dev-logs?tags=${encodeURIComponent(JSON.stringify(tags))}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to search dev logs by tags');
    }

    const data = await response.json();
    
    // 서버 응답을 DevLog 타입으로 변환
    const devLogs: DevLog[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags,
      imageUrl: item.image_url,
      views: item.views || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
    
    return { data: devLogs, error: null }
  } catch (error) {
    console.error('Error searching dev logs by tags:', error)
    return { data: null, error }
  }
}

// 제목과 내용으로 개발 일지 검색
export const searchDevLogsByText = async (searchText: string): Promise<{ data: DevLog[] | null; error: any }> => {
  try {
    const response = await fetch(`/api/dev-logs?search=${encodeURIComponent(searchText)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to search dev logs by text');
    }

    const data = await response.json();
    
    // 서버 응답을 DevLog 타입으로 변환
    const devLogs: DevLog[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags,
      imageUrl: item.image_url,
      views: item.views || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
    
    return { data: devLogs, error: null }
  } catch (error) {
    console.error('Error searching dev logs by text:', error)
    return { data: null, error }
  }
}
