DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryVersionReview_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryVersionReview_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @EntryId nvarchar(100),
    @EntryVersion int,
    @Author nvarchar(100),
    @Anonymous bit,
    @Rating number,
    @Comment nvarchar(MAX)
AS
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @OwnerId AND [Id] = @EntryId) AND
       EXISTS(SELECT 1 FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion)
        BEGIN
            IF EXISTS(SELECT * FROM [dbo].[LibraryEntryVersionReview] WHERE [Id] = @Id)
                BEGIN
                    UPDATE [dbo].[LibraryEntryVersionReview]
                    SET [Anonymous] = @Anonymous,
                        [Rating] = @Rating,
                        [Comment] = @Comment,
                        [LastModified] = @ts
                    WHERE 
                        [Id] = @Id
                END
            ELSE
                BEGIN
                    INSERT INTO [dbo].[LibraryEntryVersionReview]
                    VALUES (@Id, @OwnerId, @EntryId, @EntryVersion, @Author, @ts, @ts, @Anonymous, @Rating, @Comment, NULL)
                END
        END
END
GO