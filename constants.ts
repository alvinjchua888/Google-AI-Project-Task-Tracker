
import type { Priority, Status } from './types';

export const STATUSES: Status[] = [
    'To Do' as Status.ToDo, 
    'In Progress' as Status.InProgress, 
    'Done' as Status.Done
];

export const PRIORITIES: Priority[] = [
    'Low' as Priority.Low, 
    'Medium' as Priority.Medium, 
    'High' as Priority.High
];
