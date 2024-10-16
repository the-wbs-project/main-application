DECLARE @RecordId NVARCHAR(100) = 'P-807126'

SELECT COUNT(*)
FROM [dbo].[Projects]
WHERE RecordId = @RecordId

DECLARE @Id VARCHAR(10)
EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)


EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)


EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)


EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)

EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)

EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)

EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)

EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)

EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)

EXEC [dbo].[Project_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = @RecordId)
