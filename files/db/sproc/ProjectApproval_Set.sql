DROP PROCEDURE IF EXISTS [dbo].[ProjectApproval_Set]
GO

CREATE PROCEDURE [dbo].[ProjectApproval_Set]
    @Id nvarchar(100),
    @ProjectId nvarchar(100),
    @OwnerId nvarchar(100),
    @ApprovedOn datetimeoffset = null,
    @ApprovedBy nvarchar(100) = null,
    @IsApproved bit = null
AS
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[Projects] WHERE [Id] = @ProjectId AND [OwnerId] = @OwnerId)
        BEGIN
            IF EXISTS(SELECT 1 FROM [dbo].[ProjectApproval] WHERE [Id] = @Id AND [ProjectId] = @ProjectId)
                BEGIN
                    UPDATE [dbo].[ProjectApproval] SET
                        [ApprovedOn] = @ApprovedOn,
                        [ApprovedBy] = @ApprovedBy,
                        [IsApproved] = @IsApproved
                    WHERE [Id] = @Id AND [ProjectId] = @ProjectId
                END
            ELSE
                BEGIN
                    INSERT INTO [dbo].[ProjectApproval] (
                        [Id],
                        [ProjectId],
                        [ApprovedOn],
                        [ApprovedBy],
                        [IsApproved]
                    ) VALUES (
                        @Id,
                        @ProjectId,
                        @ApprovedOn,
                        @ApprovedBy,
                        @IsApproved
                    )
                END
        END
END
GO
