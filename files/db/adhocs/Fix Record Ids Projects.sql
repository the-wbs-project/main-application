SELECT COUNT(*)
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634'

DECLARE @Id VARCHAR(10)
EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[Projects]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[Projects]
WHERE RecordId = 'L-911634')
