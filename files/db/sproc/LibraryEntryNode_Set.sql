DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryNode_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryNode_Set]
    @EntryId nvarchar(100),
    @EntryVersion int,
    @Upserts [nvarchar](MAX),
    @RemoveIds [nvarchar](MAX)
AS
BEGIN
    MERGE [dbo].[LibraryEntryNodes] AS target  
		USING (
			SELECT
        [Id] as [Id],
        [ParentId],
        [PhaseIdAssociation],
        [Order],
        [Title],
        [Description],
        [DisciplineIds],
        [LibraryLink],
        [LibraryTaskLink],
        [Visibility]
    FROM OPENJSON (@Upserts) WITH (
                [Id] nvarchar(100),
                [ParentId] nvarchar(100),
                [PhaseIdAssociation] nvarchar(100),
                [Order] int,
                [Title] nvarchar(MAX),
                [Description] nvarchar(MAX),
                [DisciplineIds] nvarchar(MAX),
                [LibraryLink] nvarchar(MAX),
                [LibraryTaskLink] nvarchar(MAX),
                [Visibility] nvarchar(50)
            )) AS source (
                [Id],
                [ParentId],
                [PhaseIdAssociation],
                [Order],
                [Title],
                [Description],
                [DisciplineIds],
                [LibraryLink],
                [LibraryTaskLink],
                [Visibility]
            )  
		ON (
            target.[EntryId] = @EntryId AND
        target.[EntryVersion] = @EntryVersion AND
        target.[Id] = source.[Id])  

		WHEN NOT MATCHED THEN
			INSERT (
                [Id],
                [EntryId],
                [EntryVersion],
                [ParentId],
                [PhaseIdAssociation],
                [Order],
                [CreatedOn],
                [LastModified],
                [Title],
                [Description],
                [DisciplineIds],
                [LibraryLink],
                [LibraryTaskLink],
                [Visibility],
                [Removed])
            VALUES (
                source.[Id],
                @EntryId,
                @EntryVersion,
                source.[ParentId],
                source.[PhaseIdAssociation],
                source.[Order],
                GETUTCDATE(),
                GETUTCDATE(),
                source.[Title],
                source.[Description],
                source.[DisciplineIds],
                source.[LibraryLink],
                source.[LibraryTaskLink],
                source.[Visibility],
                0)
		WHEN MATCHED THEN
			UPDATE SET
                [ParentId] = source.[ParentId],  
                [PhaseIdAssociation] = source.[PhaseIdAssociation],  
                [Order] = source.[Order], 
                [LastModified] = GETUTCDATE(),  
                [Title] = source.[Title],  
                [Description] = source.[Description],  
                [DisciplineIds] = source.[DisciplineIds], 
                [LibraryLink] = source.[LibraryLink], 
                [LibraryTaskLink] = source.[LibraryTaskLink], 
                [Visibility] = source.[Visibility]
    ;

    DELETE FROM [dbo].[LibraryEntryNodes]
    WHERE
        [EntryId] = @EntryId AND
        [EntryVersion] = @EntryVersion AND
        [Id] IN (SELECT [value]
        FROM OPENJSON(@RemoveIds))

    UPDATE [dbo].[LibraryEntryVersions]
    SET [LastModified] = GETUTCDATE()
    WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion
END
GO
