DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryNode_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryNode_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @EntryId nvarchar(100),
    @EntryVersion int,
    @ParentId nvarchar(100),
    @Order int,
    @Title nvarchar(MAX),
    @Description nvarchar(MAX),
    @DisciplineIds nvarchar(MAX)
AS
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @OwnerId AND [Id] = @EntryId) AND
       EXISTS(SELECT 1 FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion)
        BEGIN
            IF EXISTS(SELECT 1 FROM [dbo].[LibraryEntryNodes] WHERE [Id] = @Id AND [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion)
                BEGIN
                    UPDATE [dbo].[LibraryEntryNodes] SET
                        [ParentId] = @ParentId,
                        [Order] = @Order,
                        [Title] = @Title,
                        [Description] = @Description,
                        [DisciplineIds] = @DisciplineIds,
                        [LastModified] = GETUTCDATE()
                    WHERE [Id] = @Id AND [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion
                END
            ELSE
                BEGIN
                    INSERT INTO [dbo].[LibraryEntryNodes] (
                        [Id],
                        [EntryId],
                        [EntryVersion],
                        [ParentId],
                        [Order],
                        [Title],
                        [Description],
                        [DisciplineIds],
                        [CreatedOn],
                        [LastModified],
                        [Removed]
                    ) VALUES (
                        @Id,
                        @EntryId,
                        @EntryVersion,
                        @ParentId,
                        @Order,
                        @Title,
                        @Description,
                        @DisciplineIds,
                        GETUTCDATE(),
                        GETUTCDATE(),
                        0
                    )
                END
        END
END
GO
