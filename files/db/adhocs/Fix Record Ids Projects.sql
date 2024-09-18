DECLARE @RecordId NVARCHAR(100) = 'L-487929'

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
