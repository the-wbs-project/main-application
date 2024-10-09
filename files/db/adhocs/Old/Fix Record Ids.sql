DECLARE @RecordId NVARCHAR(100) = 'L-435313'

SELECT COUNT(*)
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId

DECLARE @Id VARCHAR(10)
EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)


EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)

EXEC [dbo].[LibraryEntry_GetNewId] @Id OUTPUT

UPDATE [dbo].[LibraryEntries]
SET RecordId = @Id
WHERE Id IN (SELECT TOP 1
    Id
FROM [dbo].[LibraryEntries]
WHERE RecordId = @RecordId)
